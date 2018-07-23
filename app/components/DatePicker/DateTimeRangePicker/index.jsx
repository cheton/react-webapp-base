import i18next from 'i18next';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import uncontrollable from 'uncontrollable';
import DatePicker, { TimeInput, DateInput } from '@trendmicro/react-datepicker';
import i18n from 'app/lib/i18n';
import styles from './index.styl';

class DateTimeRangePicker extends PureComponent {
    static propTypes = {
        locale: PropTypes.string,
        minDate: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),
        maxDate: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),
        startDate: PropTypes.string,
        startTime: PropTypes.string,
        endDate: PropTypes.string,
        endTime: PropTypes.string,
        onChangeStartDate: PropTypes.func,
        onChangeStartTime: PropTypes.func,
        onChangeEndDate: PropTypes.func,
        onChangeEndTime: PropTypes.func
    };

    static defaultProps = {
        locale: i18next.language,
        minDate: null,
        maxDate: null
    };

    render() {
        const {
            locale,
            minDate,
            maxDate,
            startDate,
            startTime,
            endDate,
            endTime,
            onChangeStartDate,
            onChangeStartTime,
            onChangeEndDate,
            onChangeEndTime
        } = this.props;

        return (
            <div className={styles.datePickerPane}>
                <div className={styles.datePickerPaneHeader}>
                    <div className={styles.inputIconGroup}>
                        <DateInput
                            value={startDate}
                            minDate={minDate}
                            maxDate={maxDate}
                            onChange={onChangeStartDate}
                        />
                    </div>
                    <div className={styles.inputIconGroup}>
                        <TimeInput
                            value={startTime}
                            onChange={onChangeStartTime}
                        />
                    </div>
                    <div className={styles.tilde}>~</div>
                    <div className={styles.inputIconGroup}>
                        <DateInput
                            value={endDate}
                            minDate={minDate}
                            maxDate={maxDate}
                            onChange={onChangeEndDate}
                        />
                    </div>
                    <div className={styles.inputIconGroup}>
                        <TimeInput
                            value={endTime}
                            onChange={onChangeEndTime}
                        />
                    </div>
                </div>
                <div className={styles.datePickerPaneBody}>
                    <div className={styles.datePickerPaneContainer}>
                        <DatePicker
                            date={startDate}
                            dateFormatCalendar={i18n.t('locale:moment.lc_calendar_month')}
                            locale={locale}
                            minDate={minDate}
                            maxDate={maxDate}
                            onSelect={onChangeStartDate}
                        />
                    </div>
                    <div className={styles.datePickerPaneContainer}>
                        <DatePicker
                            date={endDate}
                            dateFormatCalendar={i18n.t('locale:moment.lc_calendar_month')}
                            locale={locale}
                            minDate={minDate}
                            maxDate={maxDate}
                            onSelect={onChangeEndDate}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default uncontrollable(DateTimeRangePicker, {
    // Define the pairs of prop/handlers you want to be uncontrollable
    startDate: 'onChangeStartDate',
    startTime: 'onChangeStartTime',
    endDate: 'onChangeEndDate',
    endTime: 'onChangeEndTime'
});
