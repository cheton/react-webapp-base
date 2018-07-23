import _max from 'lodash/max';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Button } from 'app/components/Buttons';
import Dropdown, { MenuItem } from 'app/components/Dropdown';
import Space from 'app/components/Space';
import TMIcon from 'app/components/TMIcon';
import i18n from 'app/lib/i18n';
import DateTimeRangePicker from '../DateTimeRangePicker';

const normalizeDateString = (dateString) => {
    let m = moment(dateString);
    if (!m.isValid()) {
        m = moment();
    }
    return m.format('YYYY-MM-DD');
};

const normalizeTimeString = (timeString) => {
    let [hh = '00', mm = '00', ss = '00'] = timeString.split(':');
    hh = Number(hh) || 0;
    mm = Number(mm) || 0;
    ss = Number(ss) || 0;
    hh = (hh < 0 || hh > 23) ? '00' : ('0' + hh).slice(-2);
    mm = (mm < 0 || mm > 59) ? '00' : ('0' + mm).slice(-2);
    ss = (ss < 0 || ss > 59) ? '00' : ('0' + ss).slice(-2);
    return `${hh}:${mm}:${ss}`;
};

const mapPeriodToString = (period) => {
    if (period === 'custom') {
        return i18n._('Custom range...');
    }

    // Only days are supported (e.g. 1, 7, '1d', or '7d')
    if (Number.isInteger(period) || period.match(/^\d+d$/)) {
        const days = parseInt(period, 10);
        if (days === 1) {
            return i18n._('Today');
        }
        if (days > 1) {
            return i18n._('Last {{n}} days', { n: days });
        }
    }

    return '';
};

class DateTimeRangePickerDropdown extends PureComponent {
    static propTypes = {
        locale: PropTypes.string,
        startDate: PropTypes.string,
        startTime: PropTypes.string,
        endDate: PropTypes.string,
        endTime: PropTypes.string,
        periods: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ])
        ),
        period: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        defaultPeriod: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        onSelect: PropTypes.func
    };

    static defaultProps = {
        periods: ['1d', '7d', '14d', '30d', '60d'],
        defaultPeriod: '7d'
    };

    state = this.getInitialState();

    static getDerivedStateFromProps(nextProps, prevState) {
        let nextState = null;

        if (!!nextProps.period && (prevState.period !== nextProps.period)) {
            nextState = {
                ...nextState,
                period: nextProps.period
            };
        }

        if (!!nextProps.startDate && (prevState.startDate !== nextProps.startDate)) {
            nextState = {
                ...nextState,
                startDate: nextProps.startDate,
                nextStartDate: nextProps.startDate
            };
        }

        if (!!nextProps.startTime && (prevState.startTime !== nextProps.startTime)) {
            nextState = {
                ...nextState,
                startTime: nextProps.startTime,
                nextStartTime: nextProps.startTime
            };
        }

        if (!!nextProps.endDate && (prevState.endDate !== nextProps.endDate)) {
            nextState = {
                ...nextState,
                endDate: nextProps.endDate,
                nextEndDate: nextProps.endDate
            };
        }

        if (!!nextProps.endTime && (prevState.endTime !== nextProps.endTime)) {
            nextState = {
                ...nextState,
                endTime: nextProps.endTime,
                nextEndTime: nextProps.endTime
            };
        }

        return nextState;
    }

    changeStartDate = (date) => {
        if (!date) {
            return;
        }

        this.setState(state => {
            const startDate = normalizeDateString(date);
            const endDate = normalizeDateString(state.nextEndDate);
            const startTime = normalizeTimeString(state.nextStartTime);
            const endTime = normalizeTimeString(state.nextEndTime);
            const isoStartDateTime = `${startDate}T${startTime}`;
            const isoEndDateTime = `${endDate}T${endTime}`;
            const isEndDateAfterMaxDate = state.maxDate && moment(endDate).isAfter(moment(state.maxDate).endOf('day'));
            const isSameOrAfterEnd = moment(isoStartDateTime).isSameOrAfter(isoEndDateTime);

            let nextEndDate = endDate;
            if (isEndDateAfterMaxDate) {
                nextEndDate = normalizeDateString(state.maxDate);
            } else if (isSameOrAfterEnd) {
                nextEndDate = startDate;
            }

            return {
                nextStartDate: startDate,
                nextEndDate: nextEndDate,
                nextStartTime: startTime,
                nextEndTime: isSameOrAfterEnd ? startTime : endTime
            };
        });
    };

    changeEndDate = (date) => {
        if (!date) {
            return;
        }

        this.setState(state => {
            const startDate = normalizeDateString(state.nextStartDate);
            const endDate = normalizeDateString(date);
            const startTime = normalizeTimeString(state.nextStartTime);
            const endTime = normalizeTimeString(state.nextEndTime);
            const isoStartDateTime = `${startDate}T${startTime}`;
            const isoEndDateTime = `${endDate}T${endTime}`;
            const isStartDateBeforeMinDate = state.minDate && moment(startDate).isBefore(moment(state.minDate).startOf('day'));
            const isSameOrBeforeStart = moment(isoEndDateTime).isSameOrBefore(isoStartDateTime);

            let nextStartDate = startDate;
            if (isStartDateBeforeMinDate) {
                nextStartDate = normalizeDateString(state.minDate);
            } else if (isSameOrBeforeStart) {
                nextStartDate = endDate;
            }

            return {
                nextStartDate: nextStartDate,
                nextEndDate: endDate,
                nextStartTime: isSameOrBeforeStart ? endTime : startTime,
                nextEndTime: endTime
            };
        });
    };

    changeStartTime = (time = '00:00:00') => {
        this.setState(state => {
            const startDate = normalizeDateString(state.nextStartDate);
            const endDate = normalizeDateString(state.nextEndDate);
            const startTime = normalizeTimeString(time);
            const endTime = normalizeTimeString(state.nextEndTime);
            const isoStartDateTime = `${startDate}T${startTime}`;
            const isoEndDateTime = `${endDate}T${endTime}`;
            const isSameOrAfterEnd = moment(isoStartDateTime).isSameOrAfter(isoEndDateTime);

            return {
                nextStartTime: startTime,
                nextEndTime: isSameOrAfterEnd ? startTime : endTime
            };
        });
    };

    changeEndTime = (time = '00:00:00') => {
        this.setState(state => {
            const startDate = normalizeDateString(state.nextStartDate);
            const endDate = normalizeDateString(state.nextEndDate);
            const startTime = normalizeTimeString(state.nextStartTime);
            const endTime = normalizeTimeString(time);
            const isoStartDateTime = `${startDate}T${startTime}`;
            const isoEndDateTime = `${endDate}T${endTime}`;
            const isSameOrBeforeStart = moment(isoEndDateTime).isSameOrBefore(isoStartDateTime);

            return {
                nextStartTime: isSameOrBeforeStart ? endTime : startTime,
                nextEndTime: endTime
            };
        });
    };

    handleDropdownSelect = (eventKey) => {
        const period = eventKey;

        if (period !== this.state.period) {
            const days = parseInt(this.props.defaultPeriod, 10) || parseInt(DateTimeRangePickerDropdown.defaultProps.defaultPeriod, 10) || 0;
            const startOfDay = moment().startOf('day');
            const endOfDay = moment().endOf('day');
            const startDate = moment(startOfDay).subtract((days > 0) ? (days - 1) : 0, 'days').format('YYYY-MM-DD');
            const startTime = moment(startOfDay).subtract((days > 0) ? (days - 1) : 0, 'days').format('HH:mm:ss');
            const endDate = moment(endOfDay).format('YYYY-MM-DD');
            const endTime = moment(endOfDay).format('HH:mm:ss');

            this.setState(state => ({
                period,
                startDate,
                startTime,
                endDate,
                endTime
            }));
        }

        this.setState(state => ({
            nextStartDate: state.startDate,
            nextStartTime: state.startTime,
            nextEndDate: state.endDate,
            nextEndTime: state.endTime
        }), () => {
            const { onSelect } = this.props;

            if (typeof onSelect !== 'function') {
                return;
            }

            const { period, startDate, startTime, endDate, endTime } = this.state;
            if (period === 'custom') {
                onSelect({ period, startDate, startTime, endDate, endTime });
            } else {
                onSelect({ period });
            }
        });
    };

    handleDropdownClose = () => {
        this.setState(state => ({
            open: false,

            // Restore to previous state
            nextStartDate: state.startDate,
            nextStartTime: state.startTime,
            nextEndDate: state.endDate,
            nextEndTime: state.endTime
        }));
    };

    handleDropdownToggle = (open) => {
        this.setState(state => {
            const { period } = state;
            return {
                open: open || period === 'custom'
            };
        });
    };

    handleClickApplyForCustomRange = () => {
        this.setState(state => ({
            open: false,

            // Apply specified range
            startDate: state.nextStartDate,
            startTime: state.nextStartTime,
            endDate: state.nextEndDate,
            endTime: state.nextEndTime
        }), () => {
            const { onSelect } = this.props;

            if (typeof onSelect !== 'function') {
                return;
            }

            const { period, startDate, startTime, endDate, endTime } = this.state;
            if (period === 'custom') {
                onSelect({ period, startDate, startTime, endDate, endTime });
            } else {
                onSelect({ period });
            }
        });
    };

    handleClickCancelForCustomRange = () => {
        this.setState(state => ({
            open: false,

            // Restore to previous state
            nextStartDate: state.startDate,
            nextStartTime: state.startTime,
            nextEndDate: state.endDate,
            nextEndTime: state.endTime
        }));
    };

    getInitialState() {
        const days = parseInt(this.props.defaultPeriod, 10) || parseInt(DateTimeRangePickerDropdown.defaultProps.defaultPeriod, 10) || 0;
        const maxDays = _max(this.props.periods.map(period => parseInt(period, 10)));
        const startOfDay = moment().startOf('day');
        const endOfDay = moment().endOf('day');
        const {
            startDate = moment(startOfDay).subtract((days > 0) ? (days - 1) : 0, 'days').format('YYYY-MM-DD'),
            startTime = moment(startOfDay).subtract((days > 0) ? (days - 1) : 0, 'days').format('HH:mm:ss'),
            endDate = moment(endOfDay).format('YYYY-MM-DD'),
            endTime = moment(endOfDay).format('HH:mm:ss')
        } = this.props;
        const minDate = moment(startOfDay).subtract((maxDays > 0) ? (maxDays - 1) : 0, 'days').format('YYYY-MM-DD');
        const maxDate = null; // no maximum

        return {
            minDate: minDate,
            maxDate: maxDate,

            // prev
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,

            // next
            nextStartDate: startDate,
            nextStartTime: startTime,
            nextEndDate: endDate,
            nextEndTime: endTime,

            // Dropdown
            open: false,
            period: this.props.period
        };
    }

    render() {
        const { locale, periods } = this.props;
        const {
            minDate, maxDate,
            nextStartDate, nextStartTime, nextEndDate, nextEndTime
        } = this.state;
        const period = this.state.period !== undefined ? this.state.period : this.props.defaultPeriod;
        const showDateTimeRangePicker = this.state.open && (period === 'custom');

        return (
            <Dropdown
                open={this.state.open}
                onSelect={this.handleDropdownSelect}
                onClose={this.handleDropdownClose}
                onToggle={this.handleDropdownToggle}
            >
                <Dropdown.Toggle>
                    <TMIcon name="calendar" />
                    <Space width={8} />
                    {mapPeriodToString(period)}
                </Dropdown.Toggle>
                <Dropdown.MenuWrapper style={{ whiteSpace: 'nowrap' }}>
                    <Dropdown.Menu>
                        {periods.map(period => (
                            <MenuItem eventKey={period} key={period}>
                                {mapPeriodToString(period)}
                            </MenuItem>
                        ))}
                        <MenuItem divider />
                        <MenuItem eventKey="custom">
                            {mapPeriodToString('custom')}
                        </MenuItem>
                    </Dropdown.Menu>
                    {showDateTimeRangePicker &&
                    <div
                        style={{
                            display: 'inline-block',
                            borderLeft: '1px solid #ddd',
                            padding: 12
                        }}
                    >
                        <DateTimeRangePicker
                            locale={locale}
                            minDate={minDate}
                            maxDate={maxDate}
                            startDate={nextStartDate}
                            startTime={nextStartTime}
                            endDate={nextEndDate}
                            endTime={nextEndTime}
                            onChangeStartDate={this.changeStartDate}
                            onChangeStartTime={this.changeStartTime}
                            onChangeEndDate={this.changeEndDate}
                            onChangeEndTime={this.changeEndTime}
                        />
                        <div className="clearfix">
                            <div className="pull-right">
                                <Button
                                    btnStyle="primary"
                                    style={{ marginRight: 8 }}
                                    onClick={this.handleClickApplyForCustomRange}
                                >
                                    {i18n._('Apply')}
                                </Button>
                                <Button onClick={this.handleClickCancelForCustomRange}>
                                    {i18n._('Cancel')}
                                </Button>
                            </div>
                        </div>
                    </div>
                    }
                </Dropdown.MenuWrapper>
            </Dropdown>
        );
    }
}

export default DateTimeRangePickerDropdown;
