<template>
	<view class="c-container">
		<view class="c-box">
			我的运动情况
		</view>
		<view class="c-box">
			<view class="charts-box">
				<qiun-data-charts type="tarea" :chartData="chartData" background="none" />
			</view>
		</view>

		<button type="default" @click="sendMsg()">发送信息</button>
		<button type="default" @click="getUserRun()">获取微信运动数据</button>
		<view v-for="(item,index) in stepInfoList" :key="index">
			{{item.step}} {{item.timestamp}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chartData: {
					// categories: ["2013 ", "2014 ", "2015 ", "2016 ", "2017 ", "2018 "],
					series: [{
							name: "本周",
							data: [35, 36, 31, 33, 13, 34]
						},
						{
							name: "上周",
							data: [18, 27, 21, 24, 6, 28]
						}
					],
				},
				stepInfoList: [],
			}
		},
		onLoad() {
			// this.getUserRun();
		},

		methods: {
			sendMsg() {
				uni.request({
					url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=8d1376d4-5069-4b36-b47e-1a043b2b6cef',
					method: 'POST',
					data: {
						"msgtype": "text",
						"text": {
							"content": "Hello World"
						}
					},
					success: res => {
						console.log(res)
						uni.showToast({
							title: '发送成功'
						});
					},
					fail: () => {},
					complete: () => {}
				});
			},
			formatMyDate(stepInfoList) {
				stepInfoList.forEach((item, $index, stepInfoList) => {
					console.log(item.step);
					console.log(item.timestamp / (1000 * 60 *60))
				})
			},
			getWeRunInfo(runres) {
				uni.request({
					url: 'https://api.rjxh.cloud/wx/weRun',
					method: 'POST',
					header: {
						"openId": 'okAt75eAWsgildcbMnpDdCR7GTWI',
					},
					data: runres,
					success: res => {
						if (res.data.code == 200) {
							this.stepInfoList = res.data.data;
							this.formatMyDate(this.stepInfoList);
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络问题',
							icon: 'none'
						});
					},
					complete: () => {}
				});
				console.log(runres)
			},
			getUserRun() {
				wx.getSetting({
					success: (res) => {
						if (!res.authSetting['scope.werun']) {
							wx.authorize({
								scope: "scope.werun",
								success: ares => {
									console.log("允许")
									console.log("ares", ares)
									wx.getWeRunData({
										success: runres => {
											console.log(runres)
										}
									})
								},
								fail: ares => {
									console.log("不允许")
								}
							});
						} else {
							wx.checkSession({
								success: cres => {
									//session_key 未过期，并且在本生命周期一直有效
									console.log("session_key 未过期，并且在本生命周期一直有效");
									wx.getWeRunData({
										success: runres => {
											this.getWeRunInfo(runres);
										}
									})
								},
								fail() {
									uni.showToast({
										title: '请登录先之后再使用',
										icon: "none"
									});
								}
							})

						}
					}
				})
			},
		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
	}

	.c-container {}

	.c-box {
		background-color: #FFFFFF;
		padding: 30rpx;
		margin: 10rpx 20rpx;
		border-radius: 25rpx;
	}

	/* 请根据需求修改图表容器尺寸，如果父容器没有高度图表则会显示异常 */
	.charts-box {
		width: 100%;
		height: 300px;
	}
</style>
