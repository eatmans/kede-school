<template>
	<view class="u-demo">
		<view class="">
			<view class="">
				每日箴言
			</view>
			<view class="">
				黄金时代是在我们的前面，而不在我们的后面。
			</view>
		</view>
		<!-- <view class="c-header">
			<u-tabs v-if="control" bg-color="#fafafa" :bold="bold" :active-color="activeColor" :list="list"
				@change="change" :current="current" :is-scroll="isScroll" :offset="offset"></u-tabs>
		</view> -->

		<view class="c-body">
<!-- 			<view class="c-banner">
				<u-swiper :list="adList"></u-swiper>
			</view> -->

			<view class="c-boxs">
				<view class="c-box">
					<view class="c-box-top">
						<view class="c-box-top-input">

						</view>
					</view>
					<view class="c-box-center">
						<!-- <image class="c-image" src="../../static/man-box.jpg" mode=""></image> -->
					</view>
					<view class="c-box-bottom">
						<view class="c-button">放入1张男生纸条</view>
						<view class="c-button">抽取1张男生纸条</view>
					</view>
				</view>
				<view class="c-box">
					<view class="c-box-top">
						<view class="c-box-top-input">
				
						</view>
					</view>
					<view class="c-box-center">
						<!-- <image class="c-image" src="../../static/man-box.jpg" mode=""></image> -->
					</view>
					<view class="c-box-bottom">
						<view class="c-button">放入1张男生纸条</view>
						<view class="c-button">抽取1张男生纸条</view>
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
				adList: [{
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				],
				list: [],
				data: [{
					name: '我的纸条',
					// count: 100
				}, {
					name: '抽个对象',
					// count: 7
				}],
				current: 0,
				sectionCurrent: 0,
				isScroll: false,
				tabCountIndex: 0,
				activeColor: this.$u.color['primary'],
				bold: false,
				control: true,
				offset: [5, -5]
			}
		},
		onLoad() {
			this.list = this.data;
		},
		methods: {
			change(index) {
				this.current = index;
			},
			modeChange(index) {
				this.control = false;
				this.current = 0;
				if (index == 0) {
					this.isScroll = true;
					this.list = this.data;
					this.offset = [5, -5]
				} else {
					this.isScroll = false;
					this.countChange(this.tabCountIndex);
				}
				this.$nextTick(() => {
					this.control = true;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-config-wrap {}

	.c-header {
		width: 100%;
		// background-color: #18B566;
	}


	.c-box {
		margin: 20rpx;
		height: 450rpx;
		width: 46%;
		border-radius: 20rpx;
		background-color: #309bff;
	}

	.c-box-top {
		display: flex;
		align-items: center;
		height: 100rpx;
		width: 100%;
		border-radius: 20rpx 20rpx 0 0;
		background-color: #2474ea;
	}
	
	.c-box-top-input{
		height: 30rpx;
		width: 60%;
		border-radius: 10rpx;
		background-color: #b4b6be;
	}
	
	.c-image{
		width: 200rpx;
		height: 200rpx;
	}
	
	.c-button{
		margin: 10rpx 20rpx;
			border-radius: 10rpx;
		color: #FFFFFF;
		background-color: #000000;
	}
</style>
