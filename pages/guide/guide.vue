<template>
	<view class="c-container">
		<view class="c-box">
			<u-collapse>
				<u-collapse-item :title="item.head" v-for="(item, index) in itemList" :key="index" :open="item.open"
					:disabled="item.disabled">
					{{item.body}}
				</u-collapse-item>
			</u-collapse>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemList: [{
					head: "第一次使用本小程序？",
					body: "如果是第一次使用的话，你需要先授权登录本小程序。在授权登录的过程中，建议允许全部权限，如果正常登录成功，它会在你的微信昵称的右边显示正常，如果不是的话，需要你退出，重新授权登录。",
					open: true,
					disabled: true
				}, {
					head: "如何开启自动健康上报？",
					body: "如果你已经登录本小程序，那么你还需要在健康页中登录你的网上办事大厅账号。并且在管理个人信息中点击保存个人信息，即可开启自动上报。",
					open: true,
				}, {
					head: "Token快要过期了，怎么换新的？",
					body: "点击 我的 中的‘退出网办’,然后再回到 健康页 重新登录网办即可换新的。",
					open: true,
				}],
			}
		},
		onLoad() {
			this.enableShareMenu();
		},
		methods: {

			enableShareMenu() {
				wx.showShareMenu({
					withShareTicket: true,
					menus: ['shareAppMessage', 'shareTimeline']
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
</style>
