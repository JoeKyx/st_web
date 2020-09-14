
import Home from './components/Home';
import Game from './components/Game';
import Calibration from './components/Calibration';
import VueRouter from 'vue-router';

const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/game/:summonerName', component: Game, name: 'game' },
    { path: '/calibration', component: Calibration, name: 'calibration'},

];

export default new VueRouter({routes});

