export default function({ store, $cookies }) {
    const data = $cookies.get('data');

    if (data) {
        // Send datas to store
        store.dispatch('data/setFromCookies', data);
    } else {
        // Set initial datas
        $cookies.set('data', store.state.data, {
            // One month
            expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
            maxAge: 1000 * 3600 * 24 * 30,
        });
    }
}
