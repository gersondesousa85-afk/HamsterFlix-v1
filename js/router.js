export const router = {
  current: 'home',
  init(onChange) {
    const apply = () => {
      this.current = (location.hash.replace('#', '') || 'home');
      onChange(this.current);
    };
    window.addEventListener('hashchange', apply);
    apply();
  },
  go(route) {
    location.hash = route;
  }
};
