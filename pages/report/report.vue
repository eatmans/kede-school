<template>
	<view class="c-container">
		<view class="c-box" @click="gotoLogin()" v-if="showLoginTips">
			你还未登录网上办事大厅，点击立即登录
		</view>
		<u-modal v-model="showLoginTips" :content="content" @confirm="gotoLogin"></u-modal>
		<view class="c-box">
			上报时间段： <text class="c-token-status">{{eng2chinese(info.scheduleType)}}</text> <text
				class="c-token-status">{{isSubmited(info.scheduleType)}}</text>
		</view>
		<view class="c-box" @click="gotoManageToken()">
			Token状态： <text class="c-token-status">{{tokenStatusText}}{{expDate}}</text>
		</view>
		<view class="c-auto-info" v-if="userInfo">
			自动上报状况：
			<u-subsection width="250rpx" :list="list" :current="curNow" @change="sectionChange" active-color="#2979ff">
			</u-subsection>
		</view>
		<view class="c-auto-info" v-if="curNow == 1">
			提醒状态：
			<u-subsection width="250rpx" :list="list" :current="curNowSubscriptions" @change="startSubscribeMessage"
				active-color="#2979ff">
			</u-subsection>
		</view>
		<view class="c-box">
			<view class="c-header" @click="showPro = true">
				管理个人信息
			</view>
			<u-popup v-model="showPro" mode="bottom" length="80%" border-radius="25">
				<view class="c-box">
					<view class="c-header">
						你的个人信息
					</view>
					<view class="c-item-box">
						<view class="c-item">
							<text class="c-title">姓名：</text> <input class="c-input" type="text"
								v-model="studentInfo.stuName" placeholder="请输入姓名" />
						</view>
						<view class="c-item">
							<text class="c-title">学号：</text> <input class="c-input" type="text"
								v-model="studentInfo.stuNo" placeholder="请输入学号" />
						</view>
						<view class="c-item">
							<text class="c-title">年级：</text> <input class="c-input" type="text"
								v-model="studentInfo.grade" placeholder="请输入年级" />
						</view>
						<view class="c-item">
							<text class="c-title">班级：</text> <input class="c-input" type="text"
								v-model="studentInfo.className" placeholder="请输入班级" />
						</view>
						<view class="c-item">
							<text class="c-title">楼栋：</text> <input class="c-input" type="text"
								v-model="studentInfo.dormitoryName" placeholder="请输入楼栋" />
						</view>
						<view class="c-item">
							<text class="c-title">宿舍号：</text> <input class="c-input" type="text"
								v-model="studentInfo.dormName" placeholder="请输入宿舍号" />
						</view>
						<view class="c-item">
							<text class="c-title">床位：</text> <input class="c-input" type="text"
								v-model="studentInfo.bedNumber" placeholder="请输入床位" />
						</view>
						<view class="c-item">
							<text class="c-title">手机号码：</text>
							<input class="c-input" type="text" v-model="studentInfo.phone" placeholder="请输入手机号码" />
						</view>
						<view class="c-item">
							<text class="c-title">每日体温：</text> <input class="c-input" type="text"
								v-model="studentInfo.temperature" placeholder="保留小数点后一位" />
						</view>
						<view class="c-item">
							<text class="c-title">上一次保存时间：</text> <text
								class="c-save-time">{{formatMyTime(studentInfo.updateTime)}}</text>
						</view>
						<button class="c-submit" @click="saveStudentInfo(token)">保存个人信息</button>
					</view>
				</view>
			</u-popup>
		</view>
		<view class="c-box">
			<view class="c-header" @click="showSubmitPopup = true">
				我的上报记录
			</view>
			<u-popup v-model="showSubmitPopup" mode="bottom" length="80%" border-radius="25">
				<view class="c-box">
					<view class="c-header">
						你的上报记录
					</view>
					<view class="c-item-box">
						<view class="c-item" v-if="healthRepostList.length == 0">
							获取上传列表失败
						</view>
						<view class="c-health-item" v-for="(item,index) in healthRepostList" :key="index"
							@click="gotoDetail(item)">
							<view class="c-log-left">
								<text>{{item.reportDate}}</text> <text
									class="c-sehedule-type">{{eng2chinese(item.scheduleType)}}</text>
							</view>
							<view class="c-log-right" v-if="item.submitStatus == 'SUBMITTED'">
								<text class="c-temperature">{{item.temperature}}℃</text>
								<text class="c-on-health">{{item.onHealth?"健康":"异常"}}</text>
								<text class="c-on-school">{{item.onSchool?"在校":"离校"}}</text>
							</view>
							<view class="c-log-right" v-else>
								<text class="c-unsubimt">未上报</text>
							</view>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		<view class="c-box">
			<view class="c-item-box">
				<button class="c-submit" @click="oneStepSubmit(token)">一键上报</button>
			</view>
		</view>
		<view class="c-box">
			<view class="c-tips">
				PS：一键上报的信息以昨天同一时段的上报信息来上报，如果昨天的的同一时段没有上报，则以学生个人信息中的配置来上报。
			</view>
			<view class="c-tips">
				PS1：第一次使用，请先阅读我的页面中的使用指南。
			</view>
			<view class="c-tips">
				PS2：自动上报的时间为：晨检是7点20分，晚检是16点20分。
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token: "",
				tokenStatus: false, // token状态
				tokenStatusText: "已失效 (点击获取新的Token)",
				autoSubmit: false, // 是否开启自动提交
				info: {},
				showLoginTips: false,
				showPro: false, //展示个人信息
				showSubmitPopup: false, // 展示提交记录
				reportInfo: {
					"dormitoryName": "荷光路",
					"dormName": "520",
					"bedNumber": "3",
					"temperature": "36.5",
					"onHealth": true,
					"onSchool": true
				},
				studentInfo: {
					"bedNumber": "",
					"classCode": "",
					"className": "",
					"dormName": "",
					"dormitoryName": "",
					"grade": "",
					"healthDesc": "",
					"onHealth": "",
					"onSchool": "",
					"orgCode": "",
					"orgName": "",
					"phone": "",
					"reportDate": "",
					"scheduleType": "",
					"strokeDesc": "",
					"stuName": "",
					"stuNo": "",
					"temperature": ""
				},

				list: [{
						name: '未开启'
					},
					{
						name: '已启动'
					}
				],
				oneStepSubmitInfo: {}, // 一键上传的数据
				healthRepostList: [], // 健康上报列表
				curNow: 0,
				curNowSubscriptions: 0,
				userInfo: [],
				content: "该功能需要登录网上办事大厅，点击确认进行登录",
				expDate: ""
			}
		},
		onLoad() {
			this.initToken();
			this.enableShareMenu();
		},
		onShow() {
			this.initToken();
			this.getSubmitInfo(this.token);
			this.getHealthRepostList(this.token);
		},
		methods: {
			enableShareMenu() {
				wx.showShareMenu({
					withShareTicket: true,
					menus: ['shareAppMessage', 'shareTimeline']
				})
			},
			// 获取本地存储的Token值
			initToken() {
				try {
					const value = uni.getStorageSync('gupt_token');
					if (value) {
						this.tokenStatusText = "获取本地Token成功"
						this.token = value;
					}
				} catch (e) {
					console.log(e)
					this.tokenStatusText = "获取本地Token失败"
					uni.showToast({
						title: '获取本地Token失败',
						icon: 'none'
					});
				}
				this.userInfo = uni.getStorageSync('userInfo');

			},

			getUserSubmintSetting() {
				wx.getSetting({
					withSubscriptions: true,
					success: res => {
						if (res.subscriptionsSetting.itemSettings[
								"1ik-y1VNV1nSCIIsQF1mkagU8nFDdbkbjIAPuX3J2o8"] == 'accept') {
							this.curNowSubscriptions = 1;
						}
					}
				})
			},

			// 判断是否已经开启自动上报
			getAutoReportStatus(stuNo) {
				uni.request({
					url: 'https://api.rjxh.cloud/student/health/autoReportStatus?stuNo=' + stuNo,
					method: 'GET',
					data: {},
					success: res => {
						this.curNow = res.data.data;
						this.getUserSubmintSetting();
					}
				});
			},

			// 开启订阅消息
			startSubscribeMessage() {
				if (this.userInfo != null) {
					wx.requestSubscribeMessage({
						tmplIds: ['1ik-y1VNV1nSCIIsQF1mkagU8nFDdbkbjIAPuX3J2o8'],
						success: res => {
							//发送请求到后端，后端接收到请求后调用订阅消息接口进行推送
							var that = this
							wx.request({
								url: 'https://api.rjxh.cloud/msg/sendNotice?openId=' + this.userInfo
									.openId,
								method: "GET",
								data: {},
								success(res) {
									that.startAutoReportHealth(that.token);
								}
							})
						}
					})
				} else {
					uni.showToast({
						title: '请先登录小程序',
						icon: "none"
					});
					uni.switchTab({
						url: "../my/my",
						success: res => {

						}
					})
				}
			},
			formatMyTime(oldTime) {
				var date = new Date(oldTime);
				var mydata = date.getMonth() + 1
				return date.getFullYear() + "-" + mydata + "-" + date.getDate() + " " + date.getHours() + ":" + date
					.getMinutes() + ":" + date.getSeconds()
			},
			gotoManageToken() {
				uni.navigateTo({
					url: '../manageToken/manageToken',
				});
			},

			// 分段器
			sectionChange(index) {
				if (index) {
					this.startAutoSubmit()
				} else {
					this.closeAutoSubmit();
				}
			},

			// 开启订阅消息的分段器
			sectionChangeSub(index) {
				if (index) {
					this.startSubscribeMessage();
				} else {
					this.closeAutoSubmit();
				}
			},

			// 获取提交ID
			getSubmitInfo(guptToken) {
				uni.request({
					url: 'https://api.rjxh.cloud/student/health/initStudHealthInfo',
					method: 'GET',
					header: {
						"Authorization": guptToken,
					},
					success: res => {
						if (res.data.code == 200) {
							this.getAutoReportStatus(res.data.data.data.stuNo);
							this.getStudentInfo(res.data.data.data.stuNo);
							this.getTokenExpDate(guptToken);
							this.tokenStatusText = "有效";
							this.info = res.data.data.data;
						} else if (res.data.code == 403) {
							// this.tokenStatus = false;
							this.showLoginTips = true;
							this.tokenStatusText = "已失效 (点击获取新的Token)";

						} else if (res.data.data.resultCode == "0001") {
							// this.tokenStatus = true;
							this.tokenStatusText = "不在上报时间范围，请稍后再试";
						} else {
							this.showLoginTips = true;
							this.tokenStatusText = res.data.data.resultDesc;
							uni.showToast({
								title: res.data.data.resultDesc,
								icon: "none"
							});
						}
					},
					fail: (err) => {
						this.tokenStatusText = "未知错误！"
						console.log(err)
					},
					complete: () => {
						console.log("已经触发getSubmitInfo")
					}
				});
			},

			setStudentInit(guptToken) {
				uni.request({
					url: 'https://api.rjxh.cloud/student/health/initStudHealthInfo',
					method: 'GET',
					header: {
						"Authorization": guptToken,
					},
					success: res => {
						if (res.data.code == 200) {
							this.studentInfo = res.data.data.data;
						}
					}
				})

			},
			gotoLogin() {
				uni.navigateTo({
					url: '../login/login',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},

			oneStepSubmit(guptToken) {
				this.reportInfo.dormName = this.studentInfo.dormName;
				this.reportInfo.bedNumber = this.studentInfo.bedNumber;
				this.reportInfo.temperature = this.studentInfo.temperature;
				this.reportInfo.onSchool = this.studentInfo.onSchool;
				this.reportInfo.onHealth = this.studentInfo.onHealth;
				var result1 = Object.assign({}, this.info, this.reportInfo)
				console.log("一键上报的", result1)
				uni.request({
					url: 'https://api.rjxh.cloud/student/health/reportHealth',
					method: 'POST',
					header: {
						"Accept": "application/json, text/plain, */*",
						"Authorization": guptToken,
					},
					data: result1,
					success: res => {
						if (res.data.code == 200) {
							console.log("一步上报", res)
							this.getHealthRepostList(guptToken);
							this.isSubmited(this.info.scheduleType);
							uni.showToast({
								title: '成功上报',
								duration: 2000
							});

						} else {
							uni.showToast({
								icon: "none",
								title: res.data.desc
							});
						}
					},
					fail: (err) => {
						console.log(err)
					},
					complete: () => {}
				});

			},
			// 提交信息
			startSubmintInfo(guptToken) {
				this.getSubmitInfo(guptToken);
				var result1 = Object.assign({}, this.info, this.reportInfo) //拼接json对象
				uni.request({
					// url: 'http://student-health-log.ehall.gupt.edu.cn/student/health/reportHealth',
					url: 'https://api.rjxh.cloud/student/health/reportHealth',
					method: 'POST',
					header: {
						"Authorization": guptToken,
					},
					data: result1,
					success: res => {
						console.log(res)
						if (res.data.code == 200) {
							this.getHealthRepostList(guptToken);
							this.isSubmited(this.info.scheduleType);
							uni.showToast({
								title: '成功上报',
								duration: 2000
							});

						} else {
							uni.showToast({
								icon: "none",
								title: res.data.desc
							});
						}
					},
					fail: (err) => {
						console.log(err)
					},
					complete: () => {}
				});
			},
			// 开启自动提交信息
			// startAutoReportHealth(guptToken) {
			// 	this.getSubmitInfo(guptToken);
			// 	this.reportInfo.bedNumber = this.oneStepSubmitInfo.bedNumber;
			// 	this.reportInfo.temperature = this.oneStepSubmitInfo.temperature;
			// 	this.reportInfo.onSchool = this.oneStepSubmitInfo.onSchool;
			// 	this.reportInfo.onHealth = this.oneStepSubmitInfo.onHealth;
			// 	var result1 = Object.assign({}, this.info, this.reportInfo)
			// 	console.log(result1)
			// 	if (this.userInfo != null) {
			// 		uni.request({
			// 			url: 'https://api.rjxh.cloud/student/health/startAutoReportHealth',
			// 			method: 'POST',
			// 			header: {
			// 				"Authorization": guptToken,
			// 				"OpenId": this.userInfo.openId,
			// 			},
			// 			data: result1,
			// 			success: res => {
			// 				console.log(res)
			// 				if (res.data.code == 200) {
			// 					console.log(res.data)
			// 				} else {
			// 					uni.showToast({
			// 						icon: "none",
			// 						title: res.data.desc
			// 					});
			// 				}
			// 			},
			// 			fail: (err) => {
			// 				console.log(err)
			// 			},
			// 			complete: () => {}
			// 		});
			// 	}
			// },
			getStudentInfo(stuNo) {
				uni.request({
					url: 'https://api.rjxh.cloud/student/health/studentInfo?stuNo=' + stuNo,
					method: 'GET',
					success: res => {
						// console.log("studenInfo", res.data);
						if (res.data.code == 200) {
							uni.setStorageSync('studentInfo', res.data.data);
							this.studentInfo = res.data.data;

						} else {
							this.setStudentInit(this.token);
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			saveStudentInfo(guptToken) {
				uni.request({
					url: 'https://api.rjxh.cloud/student/health/saveStudentInfo',
					method: 'POST',
					header: {
						"Authorization": guptToken,
						"OpenId": this.userInfo.openId,
					},
					data: this.studentInfo,
					success: res => {
						if (res.data.code == 200) {
							uni.showToast({
								title: '保存成功'
							});
						} else {
							uni.showToast({
								title: '保存失败',
								icon: "none"
							});
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			closeAutoSubmit() {
				uni.request({
					url: '',
					method: 'GET',
					data: {},
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
				uni.showToast({
					icon: "none",
					title: '关闭成功'
				});
			},

			// 开启自动上报
			startAutoSubmit() {
				this.startSubscribeMessage()
				uni.showToast({
					icon: "none",
					title: '开启成功'
				});
				this.autoSubmit = true;
			},

			eng2chinese(scheduleType) {
				if (scheduleType == "MORNING") {
					return "晨检"
				} else if (scheduleType == "NOON") {
					return "午检"
				} else if (scheduleType == "NIGHT") {
					return "晚检"
				} else {
					return "非上报时间段"
				}
			},

			gotoDetail(item) {
				uni.navigateTo({
					url: '../detail/detail?item=' + encodeURIComponent(JSON.stringify(item)),
				});
			},

			isSubmited(scheduleType) {
				if (scheduleType == "MORNING") {
					this.oneStepSubmitInfo = this.healthRepostList[3]
					if (this.healthRepostList[0].submitStatus == 'SUBMITTED') {
						return "已上报"
					} else {
						return "未上报"
					}
				} else if (scheduleType == "NOON") {
					this.oneStepSubmitInfo = this.healthRepostList[4]
					if (this.healthRepostList[1].submitStatus == 'SUBMITTED') {
						return "已上报"
					} else {
						return "未上报"
					}
				} else if (scheduleType == "NIGHT") {
					this.oneStepSubmitInfo = this.healthRepostList[5]
					if (this.healthRepostList[2].submitStatus == 'SUBMITTED') {
						return "已上报"
					} else {
						return "未上报"
					}
				} else {
					return "非上报时间段"
				}
			},
			// 获取token失效时间
			getTokenExpDate(guptToken) {
				uni.request({
					url: 'https://api.rjxh.cloud/student/health/getTokenExpDate',
					method: 'GET',
					header: {
						"Authorization": guptToken,
					},
					success: res => {
						console.log(res.data)
						if (res.data.code == 200) {
							this.expDate = "期到" + res.data.data;
						}
					}
				});
			},

			//获取上报记录
			getHealthRepostList(guptToken) {
				// this.showSubmitPopup = true;
				uni.request({
					url: 'https://api.rjxh.cloud/student/health/',
					method: 'POST',
					header: {
						"Authorization": guptToken,
					},
					success: res => {
						// console.log(res)
						if (res.data.code == 200) {
							this.healthRepostList = res.data.data;
							// console.log("获取上报记录列表成功")
						} else {
							uni.showToast({
								icon: "none",
								title: res.data.desc
							});
						}
					},
					fail: (err) => {
						uni.showToast({
							icon: "none",
							title: "获取上报记录失败"
						});
					},
					complete: () => {}
				});

			}
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

	.c-auto-info {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background-color: #FFFFFF;
		padding: 30rpx;
		margin: 10rpx 20rpx;
		border-radius: 25rpx;
	}

	.c-token-status {
		color: #2979ff;
		padding: 10rpx 20rpx;
		background-color: #F8F8F8;
		border-radius: 45rpx;
	}

	.c-item-box {}

	.c-save-time {
		display: inline-block;
		text-align: left;
		width: 55%;
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
		background-color: #F8F8F8;
	}


	.c-health-item {
		display: flex;
		flex-direction: row;
		margin: 10rpx 0;
		justify-content: space-between;
		padding: 10rpx;
		border-radius: 10rpx;
		background-color: #F8F8F8;
	}

	.c-log-left {
		width: 40%;
	}

	.c-sehedule-type {
		margin: 0 10rpx;
	}

	.c-log-right {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 60%;
		color: #2979ff;
	}

	.c-temperature {
		margin: 0 10rpx;
	}

	.c-on-health {
		margin: 0 20rpx;
	}

	.c-on-school {
		margin: 0 20rpx;
	}

	.c-title {
		font-size: 30rpx;
		width: 30%;
	}

	.c-unsubimt {
		color: #606266;
	}

	.c-input {
		font-size: 30rpx;
		border-radius: 10rpx;
		padding: 0 10rpx;
	}

	.c-submit {
		color: #FFFFFF;
		background-color: #2979ff;
		margin: 10rpx 0;
		border-radius: 50rpx;
	}

	.c-tips {
		color: #b8bcc3;
	}
</style>
