
import Home from './components/Home';
import Game from './components/Game';
import VueRouter from 'vue-router';

const routes = [
    { path: '/', component: Home },
    { path: '/game/:summonerName', component: Game },
];

export default new VueRouter({routes});

