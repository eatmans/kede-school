<template>
	<view class="c-box">

		<view class="c-top">
			<view class="c-header" v-if="userInfo == null">
				<image class="c-image" :src="tx" mode="" ></image>
			</view>
			<view class="c-header2" v-if="userInfo != null">
				<image class="c-image" :src="userInfo.avatarUrl" mode=""></image>
			</view>
			<text class="c-nickname">{{userInfo.nickName ?userInfo.nickName : "未登录"}}</text>
		</view>

		<!-- 操作列表 -->
		<view class="c-lists">
			<view class="c-list" @tap="switchLanguage()">
				<text class="c-item-text">Language</text>
				<u-icon class="c-item-icon" name="arrow-right" color="#d3dbe2" size="28"></u-icon>
			</view>
			<view class="c-list" @tap="gotoUser()" v-if="userInfo.nickName == 'EATMANS'">
				<text class="c-item-text">用户面板</text>
				<u-icon class="c-item-icon" name="arrow-right" color="#d3dbe2" size="28"></u-icon>
			</view>
			<view class="c-list" @tap="gotoFeelBack()">
				<text class="c-item-text">意见反馈</text>
				<u-icon class="c-item-icon" name="arrow-right" color="#d3dbe2" size="28"></u-icon>
			</view>
			<view class="c-list" @tap="gotoHelp()">
				<text class="c-item-text">使用说明</text>
				<u-icon name="arrow-right" color="#d3dbe2" size="28"></u-icon>
			</view>

			<view class="c-list" @tap="gotoAboutUs()">
				<text class="c-item-text">关于我们</text>
				<u-icon class="c-item-icon" name="arrow-right" color="#d3dbe2" size="28"></u-icon>
			</view>
		</view>

		<view class="c-welcome" v-if="!hasLogin" @tap="userAuthorized()">
			<button class="c-sign-in">授权登录</button>
		</view>
		<view class="c-welcome" v-if="hasLogin" @tap="logoutFun()">
			<button class="c-logut">退出登录</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions,
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				userProfile: null,
				userStatus: "正常",
				tx: "../../static/logo.png",
				username: ""
			}
		},
		onLoad() {
			this.getUserInfo();
		},
		onShow() {
			this.username = "可得校园";
		},
		onShareAppMessage() {
			return {
				title: '可得校园',
				path: '/pages/index/index',
				imageUrl: 'https://transfer.rjxh.cloud/transfer/pMqn7LitId1p37dcd02e6e5856125fbc1597fa38db9b.png'
			}
		},
		computed: {
			...mapState(['hasLogin', "userInfo", "serverUrl"]),
		},
		methods: {
			...mapMutations(['login', "logout"]),
			Toast(data, duration = 1000) {
				uni.showToast(Object.assign({}, data, {
					duration
				}))
			},
			userAuthorized() {
				wx.getUserProfile({
					desc: '用于完善会员资料',
					success: res => {
						this.userProfile = res;
						this.onGetUserInfo();
					}
				})
			},
			getUserInfo() {
				let user = uni.getStorageSync("userInfo");
				if (user != "") {
					this.login(user)
				};
				wx.showShareMenu({
				  withShareTicket: true,
				  menus: ['shareAppMessage', 'shareTimeline']
				})

			},

			onGetUserInfo() {
				var that = this
				wx.login({
					success: login_res => {
						wx.request({
							url: this.serverUrl + 'user/login',
							method: 'POST',
							header: {
								'content-type': 'application/json'
							},
							data: {
								code: login_res.code, //临时登录凭证
								rawData: that.userProfile.rawData, //用户非敏感信息
								signature: that.userProfile.signature, //签名
								encrypteData: that.userProfile.encryptedData, //用户敏感信息
								iv: that.userProfile.iv //解密算法的向量
							},
							success: res => {
								if (res.data.code == 200) {
									// 7.小程序存储skey（自定义登录状态）到本地
									that.userStatus = "正常"
									this.login(res.data.data)
									uni.showToast({
										title: '登录成功'
									});
								} else if (res.data.code == 500) {
									that.userStatus = '签名失败,请退出重新授权！';
									uni.showToast({
										title: '签名失败,请退出重新授权！',
										icon: "none",
										duration: 5000
									});
								} else {
									uni.showToast({
										title: '服务器异常',
										icon: "none",
										duration: 3000
									});
								}
							},
							fail: function(error) {
								uni.showToast({
									title: '网络错误',
									icon: "none",
									duration: 3000
								});
								console.log(error);
							}

						})
					}
				})
			},
			logoutFun() {
				this.logout()
			},
			gotoAccount() {
				uni.navigateTo({
					url: '../account/account',
				});
			},
			switchLanguage() {
				uni.showToast({
					title: '努力适配中！',
					icon: 'none'
				});
			},
			gotoFeelBack() {
				uni.navigateTo({
					url: '../feelback/feelback',
				});
			},
			gotoHelp() {
				uni.navigateTo({
					url: '../help/help',
				});
			},
			gotoAboutUs() {
				uni.navigateTo({
					url: '../about/about',
				});
			},
			
			gotoUser(){
				uni.navigateTo({
					url: '../user/user',
				});
			},

			gotoTest() {
				uni.navigateTo({
					url: '../test/test',
				});
			},
		}
	}
</script>

<style>
	.c-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.c-top {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 400rpx;
		width: 100%;
		background-color: #f5f0f0;
		border-radius: 0 0 45rpx 45rpx;
	}

	.c-header {
		width: 200rpx;
		height: 200rpx;
		padding: 40rpx;
		border-radius: 50rpx;
		background-color: #FFFFFF;
	}
	
	.c-header2 {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50rpx;
		background-color: #FFFFFF;

	}

	.c-image {
		height: 100%;
		width: 100%;
		border-radius: 50rpx;
	}

	.c-nickname {
		margin-top: 20rpx;
	}

	.c-lists {
		margin-top: 30rpx;
		display: flex;
		flex-direction: column;
	}

	.c-list {
		display: flex;
		justify-content: space-between;
	}

	.c-item-text {
		margin-top: 20rpx;
		margin-right: 400rpx;
		font-size: 35rpx;
	}

	.c-item-icon {}

	.c-upgrade-pro {
		margin-top: 40rpx;
		display: flex;
		border: 2px solid transparent;
		border-radius: 30rpx;
		background-color: transparent;
		border-color: #f7aa00;
		padding: 10rpx;

	}

	.c-left {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 175rpx;
	}

	.c-righte {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.c-sign-in {
		margin-top: 50rpx;
		width: 580rpx;
		font-size: 30rpx;
		padding: 5rpx;
		border-radius: 45rpx;
		color: #FFFFFF;
		background-color: #425e92;
	}

	.c-logut {
		margin-top: 50rpx;
		width: 580rpx;
		font-size: 30rpx;
		padding: 5rpx;
		border-radius: 45rpx;
		color: #FFFFFF;
		background-color: #f7aa00;
	}

	.c-slot-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20rpx;
	}

	.c-mask-iamge {
		margin: 30rpx 0;
		width: 200rpx;
		height: 200rpx;
	}

	.c-gray {
		color: gray;
	}
</style>
