<template>
	<view class="c-container">
		<view class="c-phone-login-area">
			<view class="c-title">
				登录网上办事大厅
			</view>
			<view class="c-input-box">
				<u-field v-model="cellphone" label="手机号" placeholder="请输入手机号码"> </u-field>
			</view>
			<view class="c-input-box">
				<u-field v-model="code" label="验证码" placeholder="请填写验证码">
					<u-button size="mini" slot="right" type="primary" @click="getSMSCode">{{codeText}}</u-button>
				</u-field>
				<u-verification-code ref="uCode" @change="codeChange"></u-verification-code>
			</view>
			<view class="c-button-box">
				<button class="c-login" @click="login(cellphone,code)">登录</button>
			</view>
			<view class="c-button-box">
				<view class="c-login-token-button" @click="gotoManageToken">
					<view class="">
						或使用Token登录
					</view>
				</view>
			</view>
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
				cellphone: "",
				code: "",
				codeText: '获取验证码'
			}
		},
		onShow() {
			this.enableShareMenu();
		},

		methods: {
			enableShareMenu() {
				wx.showShareMenu({
					withShareTicket: true,
					menus: ['shareAppMessage', 'shareTimeline']
				})
			},
			gotoManageToken() {
				uni.navigateTo({
					url: '../manageToken/manageToken',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 登录
			login(cellphone, code) {
				console.log("准备登录")
				if (this.cellphone.length == 11 && this.code.length == 6) {
					uni.request({
						url: 'https://api.rjxh.cloud/student/health/login?cellphone=' + cellphone + "&code=" +
							code,
						method: 'GET',
						data: {
							cellphone: cellphone,
							code: code
						},
						success: res => {
							console.log(res)
							if (res.data.code == 200) {
								var token = "Bearer " + res.data.data;
								uni.setStorageSync('gupt_token', "Bearer " + res.data.data);
								uni.showToast({
									title: '登录成功'
								});
								// this.updateStudentToken(token, cellphone);
								setTimeout(uni.switchTab({
									url: '/pages/report/report'
								}), 1000);
							} else {
								uni.showToast({
									title: res.data.desc,
									icon: "none"
								});
							}

						},
						fail: (err) => {
							console.log(err)
						}
					});
				} else {
					uni.showToast({
						title: '手机号码或验证码长度不正常',
						icon: "none"
					});
				}

			},

			updateStudentToken(guptToken, phone) {
				uni.request({
					url: 'https://api.rjxh.cloud/student/health/updateStudentToken?phone=' + phone,
					method: 'POST',
					header: {
						"Authorization": guptToken
					},
					success: res => {
						console.log("更新个人token")
						console.log(res)
					},
					fail: () => {},
					complete: () => {}
				});
			},

			// 获取验证码
			getSMSCode() {
				console.log("this.cellphone", this.cellphone)
				if (this.cellphone.length != 11) {
					uni.showToast({
						title: '手机号码错误',
						icon: 'none'
					});
				} else {
					uni.request({
						url: 'https://api.rjxh.cloud/student/health/code?cellphone=' + this.cellphone,
						method: 'GET',
						success: res => {
							uni.showToast({
								title: "已发送",
								icon: "none"
							});
						},
						fail: (err) => {
							console.log("err", err)
						},
						complete: () => {}
					});
				}
			},

			codeChange(text) {
				this.codeText = text;
			}
		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
	}

	.c-container {
		direction: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.c-title {
		color: #393939;
		font-size: 35rpx;
		margin: 10rpx 0;
		display: flex;
		justify-content: center;
	}

	.c-input-box {
		display: flex;
		justify-content: space-between;
		margin: 10rpx 0;
	}

	.c-check-token {
		color: #007AFF;
	}

	.c-input-cellphone {
		padding: 20rpx 10rpx;
		border-radius: 50rpx;
		width: 100%;
		background-color: #F8F8F8;
	}

	.c-input {
		padding: 20rpx 10rpx;
		border-radius: 50rpx;
		background-color: #F8F8F8;
	}

	.c-login {
		color: #FFFFFF;
		background-color: #2979ff;
		border-radius: 50rpx;
	}

	.c-textarea {
		background-color: #fefefe;
		padding: 10rpx;
		height: 650rpx;
		width: 100%;
		border-radius: 10rpx;
	}

	.c-button-box {
		margin: 20rpx;
	}

	.c-login-token-button {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
		height: 70rpx;
		color: #2979ff;
		background-color: #ececec;
		border-radius: 50rpx;
		font-size: 30rpx
	}

	.c-phone-login-area {
		display: flex;
		flex-direction: column;
		justify-content: center;
		background-color: #FFFFFF;
		padding: 30rpx;
		margin: 10rpx 20rpx;
		border-radius: 25rpx;
	}
</style>
