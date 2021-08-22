<template>
	<view class="c-container">
		<u-notice-bar mode="horizontal" :list="tipList"></u-notice-bar>
		<view class="c-box c-title-area">
			<span class="c-label">标题</span>
			<input class="c-input" v-model="record.txtDRTitle" placeholder="优秀打工人的实习日志" />
		</view>
		<view class="c-box c-useranme-area">
			<span class="c-label">姓名</span>
			<input class="c-input" v-model="record.txtDRName" placeholder="例:吴默默(191702225)" />
		</view>
		<view class="c-box c-pushlish-time-area" @click="show = true">
			<span class="c-label">时间</span>
			<view class="c-input">
				{{record.txtDRPublishTime}}
			</view>
			<u-calendar v-model="show" :mode="mode" @change="selectPublishTime"></u-calendar>
		</view>
		<view class="c-box">
			<span class="c-label">工作地点</span>
			<textarea class="c-textarea-addr" v-model="record.txtDRAddr" maxlength="-1" />
		</view>
		<view class="c-box">
			<span class="c-label">工作内容描述</span>
			<textarea class="c-textarea" v-model="record.txtDRContent" disable-default-padding="true" maxlength="-1"
				placeholder="每天摸鱼" />
		</view>
		<view class="c-box">
			<button class="c-submit" @click="submitDailyRecord()">提交</button>
			<button class="c-save" @click="saveDailyRecord()">保存到草稿,下次使用</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				record: {
					txtDRTitle: "优秀打工人的实习日志",
					txtDRName: "吴晓坚(191702225)",
					txtDRPublishTime: "选择提交时间",
					txtDRAddr: "",
					txtDRContent: "",
				},
				tipList: [
					'当前不是提交时间段',
					'提交会保存到服务器中暂存。',
				],

				show: false,
				mode: 'date',
				height: 150

			}
		},
		onShow() {
			this.enableShareMenu();
			this.getStudentInfo();
		},
		methods: {
			enableShareMenu() {
				wx.showShareMenu({
					withShareTicket: true,
					menus: ['shareAppMessage', 'shareTimeline']
				})
			},

			getStudentInfo() {
				let value = uni.getStorageSync('studentInfo');
				this.record.txtDRName = value.stuName + "(" + value.stuNo + ")";
			},
			selectPublishTime(e) {
				this.record.txtDRPublishTime = e.result;
			},

			submitDailyRecord() {
				uni.request({
					url: 'https://api.rjxh.cloud/sxoa/daily_record/add',
					method: 'POST',
					data: this.record,
					success: res => {
						console.log(res)
						if (res.data.code == 200) {
							uni.showToast({
								title: '提交成功'
							});
						} else {
							uni.showToast({
								title: '错误了'
							});
						}

					},
					fail: () => {
						uni.showToast({
							title: '网络错误'
						});
					},
					complete: () => {}
				});


			},

			saveDailyRecord() {
				uni.showToast({
					title: '开发中'
				});
			}

		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
	}

	.c-box {
		background-color: #FFFFFF;
		padding: 25rpx;
		margin: 10rpx 20rpx;
		border-radius: 25rpx;
	}

	.c-label {
		display: inline-block;
		padding-bottom: 10rpx;
	}

	.c-input {
		padding: 10rpx;
		background-color: #F8F8F8;
		border-radius: 10rpx;
	}

	.c-textarea-addr {
		background-color: #F8f8f8;
		padding: 10rpx;
		margin: 0 20rpx;
		height: 60rpx;
		border-radius: 10rpx;
	}


	.c-textarea {
		background-color: #F8f8f8;
		padding: 10rpx;
		margin: 0 20rpx;
		height: 120rpx;
		border-radius: 10rpx;
	}

	.c-submit {
		color: #FFFFFF;
		background-color: #2979ff;
		margin: 10rpx 0;
		border-radius: 50rpx;
	}

	.c-save {
		color: #ffffff;
		font-size: 25rpx;
		background-color: #c5c5c5;
		margin: 10rpx 175rpx;
		border-radius: 50rpx;
	}

</style>
