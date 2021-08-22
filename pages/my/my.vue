<template>
	<view class="con">
		<view class="c-userinfo" v-if="!hasUserInfo">
			<button class="c-login-button" @tap="userAuthorized()">授权登录</button>
		</view>
		<view class="c-userinfo" v-else>
			<image class="c-avator" :src="userInfo.avatarUrl" mode=""></image>
			<view class="c-user-info-more">
				<text class="c-nick-name">{{userInfo.nickName}}</text>
				<view class="c-user-status">状态：{{userStatus}}</view>
			</view>
		</view>

		<view class="c-tools-box">
			<view class="c-tools-item" @click="gotoTodoSchedul()">
				<view class="">
					{{todoNum}}
				</view>
				<view class="c-tools-text">
					健康上报
				</view>
			</view>

			<view class="c-tools-item" @click="gotoInternshipSchedul()">
				<view class="">
					0
				</view>
				<view class="c-tools-text">
					实习日志
				</view>
			</view>
		</view>

		<view class="c-button-list">
			<view class="c-button-item">
				<view class="c-button" @click="gotoManageToken()">
					<u-icon name="pushpin" :size="46"></u-icon> <span class="c-button-text">管理Token</span>
				</view>
			</view>

			<view class="c-button-item">
				<view class="c-button" @click="gotoGuide()">
					<u-icon name="question-circle" :size="46"></u-icon> <span class="c-button-text">使用指南</span>
				</view>
			</view>
			<view class="c-button-item">
				<view class="c-button" @click="gotoFaceback()">
					<u-icon name="error-circle" :size="46"></u-icon> <span class="c-button-text">反馈问题</span>
				</view>
			</view>
			<view class="c-button-item">
				<navigator class="c-button-code" target="miniProgram" open-type="navigate" app-id="wx98bd4a935aea8f5e"
					extra-data="" version="release">
					<u-icon name="gift" :size="46"></u-icon> <span class="c-button-text">可得快传</span>
				</navigator>
			</view>
			<view class="c-button-item">
				<view class="c-button" @click="gotoAbout()">
					<u-icon name="grid" :size="46"></u-icon> <span class="c-button-text">关于</span>
				</view>
			</view>
		</view>
		<view class="c-box">
			<view class="c-button-item">
				<button class="c-button-logout" @click="logout()" v-if="hasUserInfo">
					<u-icon name="minus-circle" :size="46"></u-icon> <span class="c-button-text">退出登录</span>
				</button>
			</view>
			<view class="c-button-item" v-if="wbHasLogin">
				<button class="c-button-logout" @click="logoutWB()">
					<u-icon name="minus-circle" :size="46"></u-icon> <span class="c-button-text">退出网办</span>
				</button>
			</view>
			<view class="c-button-item" v-else-if="!wbHasLogin">
				<button class="c-button-login" @click="gotoLogin()">
					<u-icon name="pause-circle" :size="46"></u-icon> <span class="c-button-text">登录网办</span>
				</button>
			</view>
		</view>
		<view class="c-version">
			<text>
				版本v0.0.1bate
			</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hasUserInfo: false,
				userInfo: null,
				userProfile: null,
				wbHasLogin: false,
				userStatus: "正常",
				isEatmans: false,
				todoNum: 0,
				passwordNum: 0,
				dailyRecordNum: 0
			}
		},
		onLoad: function() {
			this.judgeLoginStatus();
			this.judgeGuptStatus();
			this.enableShareMenu();
			this.initUserInfo();
		},
		onShow() {
			this.judgeLoginStatus()
			this.judgeGuptStatus()
		},
		methods: {
			enableShareMenu() {
				wx.showShareMenu({
					withShareTicket: true,
					menus: ['shareAppMessage', 'shareTimeline']
				})
			},
			initUserInfo() {
				var todoListLength = uni.getStorageSync("todoList").length;
				this.todoNum = todoListLength >= 1 ? todoListLength : 0;
			},
			// 判断登录状态
			judgeLoginStatus() {
				const userInfo = uni.getStorageSync('userInfo');
				if (userInfo != null && userInfo != "") {
					this.hasUserInfo = true;
					this.userInfo = userInfo;
					if (userInfo.nickName == "EATMANS") {
						this.isEatmans = true;
					}

				}
			},
			judgeGuptStatus() {
				const gupt_token = uni.getStorageSync('gupt_token');
				if (gupt_token != null && gupt_token != "") {
					this.wbHasLogin = true;
				}
			},
			// 退出登录
			logout() {
				uni.removeStorageSync('userInfo');
				this.hasUserInfo = false;
			},
			// 退出登录
			logoutWB() {
				uni.removeStorageSync('gupt_token');
				this.wbHasLogin = false;
			},
			gotoManageToken() {
				uni.navigateTo({
					url: '../manageToken/manageToken',
				});
			},
			gotoPasswordManager() {
				uni.navigateTo({
					url: '../passwordManager/passwordManager',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},

			userAuthorized() {
				wx.getUserProfile({
					desc: '用于完善会员资料',
					success: res => {
						this.hasUserInfo = true
						this.userInfo = res.userInfo
						this.userProfile = res
						this.onGetUserInfo();
					}
				})

			},

			onGetUserInfo() {
				var that = this
				wx.login({
					success: function(login_res) {
						wx.request({
							url: 'https://api.rjxh.cloud/wx/login',
							method: 'POST',
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							data: {
								code: login_res.code, //临时登录凭证
								rawData: that.userProfile.rawData, //用户非敏感信息
								signature: that.userProfile.signature, //签名
								encrypteData: that.userProfile.encryptedData, //用户敏感信息
								iv: that.userProfile.iv //解密算法的向量
							},
							success: function(res) {
								console.log("获取的user", res.data)
								if (res.data.code == 200) {
									// 7.小程序存储skey（自定义登录状态）到本地
									that.userStatus = "正常"
									uni.setStorageSync('userInfo',
										res.data.data);
									uni.setStorageSync('skey', res.data
										.data.skey);
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

				this.hasUserInfo = true
			},
			gotoFaceback() {
				uni.navigateTo({
					url: '../faceback/faceback',
					success: res => {},
				});
			},
			gotoInternshipSchedul() {
				uni.navigateTo({
					url: '../internshipSchedul/internshipSchedul',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},

			gotoGuide() {
				uni.navigateTo({
					url: '../guide/guide',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},

			gotoAbout: function() {
				uni.navigateTo({
					url: '../about/about',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},

			gotoLogin() {
				uni.navigateTo({
					url: '../login/login',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			showTips: function() {
				uni.showToast({
					title: 'EATMANS在偷懒',
					icon: 'none',
					duration: 1000
				});
			}
		}
	}
</script>

<style coped lang="scss">
	.con {
		margin-left: 2%;
		margin-right: 2%;
	}

	.c-box {
		background-color: #F8F8F8;
		padding: 20rpx 0;
		margin: 10rpx 20rpx;
		border-radius: 25rpx;
	}

	.c-login-button {
		width: 80%;
		background-color: #2979ff;
		color: #F1F1F1;
		border-radius: 45rpx;
	}

	.c-userinfo {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 20rpx;
		padding: 20rpx;
		height: 200rpx;
		border-radius: 10rpx;
		background-color: #F8F8F8;
		color: #000000;
		font-size: 1.5em;
	}

	.c-user-info-more {
		margin: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.c-nick-name {
		font-size: 35rpx;
	}

	.c-user-status {
		display: inline-block;
		border-radius: 20rpx;
		padding: 10rpx;
		font-size: 25rpx;
		margin: 0 10rpx;
		background-color: #ffffff;
		color: #2979ff;
	}

	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}

	.c-avator {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50rpx;
	}

	.c-list {
		margin: 20rpx;
	}

	.c-button-list {
		margin: 20rpx;
		padding: 10rpx 0;
		border-radius: 20rpx;
		background-color: #F8F8F8;
	}

	.c-button-item {
		margin: 10rpx;
	}


	.c-button {
		display: flex;
		border-radius: 45rpx;
		align-items: center;
		font-size: 35rpx;
		height: 80rpx;
		padding: 0;
		color: #393B44;
		background-color: #FFFFFF;
		border: 2rpx solid #FFFFFF;
		padding-left: 20rpx;
	}

	.c-button-code {
		display: flex;
		align-items: center;
		font-size: 35rpx;
		height: 80rpx;
		padding: 0;
		background-color: #FFFFFF;
		border: 2rpx solid #FFFFFF;
		border-radius: 45rpx;
		padding-left: 20rpx;
	}

	.c-button-login {
		color: #FFF;
		background-color: #2979ff;
		border-radius: 45rpx;
		display: flex;
		align-items: center;
		font-size: 35rpx;
		height: 80rpx;
		border: 1rpx;
		padding: 0;
		padding-left: 20rpx;
	}

	.c-button-logout {
		color: #FFF;
		background-color: #fa3534;
		border-radius: 45rpx;
		display: flex;
		align-items: center;
		font-size: 35rpx;
		height: 80rpx;
		border: 1rpx;
		padding: 0;
		padding-left: 20rpx;
	}

	.c-xiushi {
		display: block;
		width: 10rpx;
		height: 100%;
		background-color: #F8F8F8;
		margin-right: 10rpx;
	}


	.c-button-text {
		margin-left: 10rpx;
		// color: #393B44;
	}

	.c-tools-box {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 20rpx;
		border-radius: 20rpx;
		background-color: #F8F8F8;
	}

	.c-tools-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10rpx;
		height: 180rpx;
		width: 280rpx;
		margin: 10rpx;
		border-radius: 20rpx;
		background-color: #FFFFFF;
	}

	.c-tools-text {
		display: flex;
	}

	.c-version {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #c8c9cc;
	}
</style>
