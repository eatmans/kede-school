import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		token: '',
		serverUrl: 'http://172.20.21.155:9999/',
		// serverUrl: 'https://tf.rjxh.cloud/',
		userInfo: '',
		openId: '',
		likeTotal: 0,
		historyList: []
	},
	getters: {

	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			state.openId = provider.openId;
			uni.setStorageSync('userInfo',
				provider);
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = '';
			state.openId = '';
			uni.removeStorageSync('userInfo');
		},
		addHistory(state, provider) {
			console.log(provider)
			state.historyList.push(provider)
			uni.setStorageSync('historyList',
				state.historyList);
		}
	}
})

export default store
