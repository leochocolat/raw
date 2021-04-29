export default function({ store, $cookies }) {
    const data = $cookies.get('data');

    if (data) {
        // Send datas to store
        store.dispatch('data/setFromCookies', data);
    } else {
        // Set initial datas
        $cookies.set('data', store.state.data);
    }

    // console.log($cookies.get('data'));
    // console.log(store.state.data);
}
