<template>
	<view class="c-container">
		<view class="c-box">
			<view class="c-header">
				你的上报详情
			</view>
			<view class="c-item-box" v-if="info.temperature != null">
				<view class="c-item">
					<text class="c-title">姓名：</text> <text class="c-text">{{info.stuName}}</text>
				</view>
				<view class="c-item">
					<text class="c-title">学号：</text> <text class="c-text">{{info.stuNo}}</text>
				</view>
				<view class="c-item">
					<text class="c-title">年级：</text> <text class="c-text">{{info.grade}}</text>
				</view>
				<view class="c-item">
					<text class="c-title">班级：</text> <text class="c-text">{{info.className}}</text>
				</view>
				<view class="c-item">
					<text class="c-title">楼栋：</text> <text class="c-text">{{info.dormitoryName}}</text>
				</view>
				<view class="c-item">
					<text class="c-title">宿舍号：</text> <text class="c-text">{{info.dormName}}</text>
				</view>
				<view class="c-item">
					<text class="c-title">床位：</text> <text class="c-text">{{info.bedNumber}}</text>
				</view>
				<view class="c-item">
					<text class="c-title">手机号码：</text> <text class="c-text">{{info.phone}}</text>
				</view>
				<view class="c-item">
					<text class="c-title">上报时间：</text> <text class="c-text">{{info.submitTime}}</text>
				</view>
				<view class="c-item">
					<text class="c-title">上报时段：</text> <text class="c-text">{{info.scheduleType}}</text>
				</view>
				<view class="c-item">
					<text class="c-title">今日体温：</text> <text class="c-text">{{info.temperature}}</text>
				</view>
			</view>
			<view class="c-item-box" v-else>
				<view class="c-unsubimt"><text>未上报</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {}
			}
		},
		onLoad: function(option) {
			const item = JSON.parse(decodeURIComponent(option.item));
			this.info = item;
			console.log("获取到数据", item)
		},
		methods: {

		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
	}

	.c-box {
		background-color: #FFFFFF;
		padding: 30rpx;
		margin: 10rpx 20rpx;
		border-radius: 25rpx;
	}


	.c-header {
		font-size: 35rpx;
		color: #393E46;
	}

	.c-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 10rpx 0;
		padding: 10rpx;
		border-radius: 10rpx;
		background-color: #FFFFFF;
	}

	.c-title {
		font-size: 35rpx;
		width: 30%;
	}

	.c-text {
		color: #000000;
	}

	.c-unsubimt {
		color: #818181;
		width: 100%;
		height: 300rpx;
		font-size: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		/* background-color: #007AFF; */
	}
</style>
