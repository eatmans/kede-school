<template>
	<view class="c-container">
		<view class="c-box">
			<view class="c-title">
				手动输入网上办事大厅的Token
			</view>
			<view class="c-textarea-box">
				<textarea class="c-textarea" v-model="token" placeholder="请输入你的Token" maxlength="9999" />
			</view>
			<text class="c-check-token">说明：{{tokenStatusText}}</text>
			<button class="c-savetoken" @click="saveToken(token)">保存Token并检查有效性</button>
		</view>
		<u-popup v-model="showLoginPopup" mode="bottom" length="60%" border-radius="25">
			<view class="c-phone-login-area">
				<view class="c-title">
					登录网上办事大厅
				</view>
				<view class="c-input-box">
					<u-field v-model="cellphone" label="手机号" placeholder="请输入手机号码"> </u-field>
				</view>
				<view class="c-input-box">
					<u-field v-model="code" label="验证码" placeholder="请填写验证码">
						<u-button size="medium" slot="right" type="success" @click="getSMSCode">{{codeText}}</u-button>
					</u-field>
					<u-verification-code ref="uCode" @change="codeChange"></u-verification-code>
				</view>
				<view class="">
					<button class="c-login" @click="login(cellphone,code)">登录</button>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				token: "", // token值
				cellphone: "", // 手机号码
				tokenStatus: false, // token的状态
				showLoginPopup: false, // 控制是否展示登录框的按钮
				tokenStatusText: "", // 需要显示Token状态
				code: "", // 验证码
				codeText: '获取验证码'
			}
		},
		onShow() {
			this.initToken();
		},
		methods: {
			// 获取本地存储的Token值
			initToken() {
				try {
					const value = uni.getStorageSync('gupt_token');
					if (value) {
						this.tokenStatusText = "获取本地Token成功"
						this.token = value;
						uni.showToast({
							title: '成功获得本地Token',
							icon: 'none'
						});
					}
				} catch (e) {
					this.tokenStatusText = "获取本地Token失败"
					uni.showToast({
						title: '获取本地Token失败',
						icon: 'none'
					});
				}

			},
			codeChange(text) {
				this.codeText = text;
			},
			// 检查Token是否有效
			checkToken(guptToken) {
				uni.showLoading({
					title: '检查Token时效中',
					mask: false
				});
				uni.request({
					url: 'https://api.rjxh.cloud/student/health/initStudHealthInfo',
					method: 'GET',
					header: {
						"Authorization": guptToken
					},
					success: res => {
						uni.hideLoading();
						console.log(res)
						console.log(res.data)
						if (res.data.code == 200) {
							this.tokenStatusText = "token有效";
						} else if (res.data.code == 403) {
							this.tokenStatusText = "该token已经失效";
						} else if (res.data.code == "0001") {
							this.tokenStatusText = "不在上报时间范围，请稍后再试";
						} else {
							this.tokenStatusText = res.data.data.resultDesc;
							uni.showToast({
								title: res.data.data.resultDesc,
								icon: "none"
							});
						}

					},
					fail: (err) => {
						uni.hideLoading();
						console.log("检查Token失败", err)
					},
					complete: () => {
						uni.hideLoading();
						console.log("已经检查了Token")
					}
				});


			},
			// 保存Token到本地存储中
			saveToken(guptToken) {
				try {
					uni.setStorageSync('gupt_token', guptToken);
					uni.showToast({
						title: '同步保存成功'
					});
				} catch (e) {
					uni.showToast({
						title: '同步保存失败'
					});
				}
				this.checkToken(guptToken);
			},

			// 登录
			login(cellphone, code) {
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
								uni.setStorageSync('gupt_token', "Bearer " + res.data.data);
								uni.showToast({
									title: '登录成功'
								});
								setTimeout(uni.switchTab({
									url: '/pages/report/report'
								}), 1000);
							} else {
								uni.showToast({
									title: res.data.desc,
									icon: "none",
									duration: 3000
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

			// 获取验证码
			getSMSCode() {
				if (this.cellphone.length != 11) {
					uni.showToast({
						title: '手机号码错误',
						icon: 'none'
					});
				} else {
					uni.request({
						// 106.52.30.216:8099
						url: 'https://api.rjxh.cloud/student/health/code?cellphone=' + this.cellphone,
						method: 'GET',
						success: res => {
							// console.log("res", res.data)
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

			}
		}
	}
</script>

<style>
	page {
		background-color: #f5f5f5;
	}

	.c-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.c-box {
		background-color: #FFFFFF;
		padding: 30rpx;
		margin: 10rpx 20rpx;
		border-radius: 25rpx;
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
		color: #2979ff;
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

	.c-hastoken {
		margin-top: 10rpx;
		color: #FFFFFF;
		background-color: #2979ff;
		border-radius: 50rpx;
	}

	.c-textarea {
		background-color: #F8F8F8;
		padding: 10rpx;
		height: 650rpx;
		width: 100%;
		border-radius: 10rpx;
	}

	.c-savetoken {
		margin-top: 20rpx;
		color: #FFFFFF;
		background-color: #2979ff;
		border-radius: 50rpx;
		font-size: 30rpx;
	}

	.c-phone-login-area {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 20rpx;
	}
</style>
