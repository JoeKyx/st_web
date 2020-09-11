
import Home from './components/Home';
import Game from './components/Game';
import VueRouter from 'vue-router';

const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/game/:summonerName', component: Game, name: 'game' },
];

export default new VueRouter({routes});

