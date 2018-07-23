const matchComponent = (Component) => (c) => {
    if (c.type === Component) {
        return true;
    }
    return false;
};

export default matchComponent;
