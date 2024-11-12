import {
	basekit,
	FieldType,
	field,
	FieldComponent,
	FieldCode,
	NumberFormatter,
	AuthorizationType,
} from '@lark-opdev/block-basekit-server-api';
const { t } = field;

// 通过addDomainList添加请求接口的域名
basekit.addDomainList(['dev.yygongzi.com', 'www.yygongzi.com']);

basekit.addField({
	// 定义捷径的i18n语言资源
	i18n: {
		messages: {
			'zh-CN': {
				bonusBefore: '选择税前年终奖字段',
				salaryBefore: '选择税前工资（月）字段',
				monthSocialInsurance: '选择个人社保公积金合计（月）字段',
				monthZxfjkchj: '选择专项附加扣除合计（月）字段',
				requireDesc: '必选项，需要选择多维表中「年终奖」列',
				desc: '批量优化年终奖个税，让员工多拿钱',
			},
			'en-US': {
				bonusBefore: 'select field of before tax year-end bonus',
				salaryBefore: 'select field of before tax salary (month)',
				monthSocialInsurance:
					'select field of total personal social security and housing fund (monthly)',
				monthZxfjkchj:
					'select field of total special additional deductions (monthly)',
				requireDesc:
					'required option, you need to select the "year-end bonus" column in the table',
				desc: 'optimizing year-end bonus and tax, allowing employees to receive more money',
			},
			'ja-JP': {},
		},
	},
	// 定义捷径的入参
	formItems: [
		{
			key: 'bonusBefore',
			label: t('bonusBefore'),
			tooltips: [
				{
					type: 'text',
					content: '仅支持数字、文本字段',
				},
			],
			component: FieldComponent.FieldSelect,
			props: {
				supportType: [FieldType.Number, FieldType.Text],
			},
			validator: {
				required: true,
			},
		},
		{
			key: 'salaryBefore',
			label: t('salaryBefore'),
			component: FieldComponent.FieldSelect,
			tooltips: [
				{
					type: 'text',
					content: '仅支持数字、文本字段',
				},
			],
			props: {
				supportType: [FieldType.Number, FieldType.Text],
			},
			validator: {
				required: false,
			},
		},
		{
			key: 'monthSocialInsurance',
			label: t('monthSocialInsurance'),
			component: FieldComponent.FieldSelect,
			tooltips: [
				{
					type: 'text',
					content: '仅支持数字、文本字段',
				},
			],
			props: {
				supportType: [FieldType.Number, FieldType.Text],
			},
			validator: {
				required: false,
			},
		},
		{
			key: 'monthZxfjkchj',
			label: t('monthZxfjkchj'),
			component: FieldComponent.FieldSelect,
			tooltips: [
				{
					type: 'text',
					content: '仅支持数字、文本字段',
				},
			],
			props: {
				supportType: [FieldType.Number, FieldType.Text],
			},
			validator: {
				required: true,
			},
		},
		{
			key: 'monthZxfjkchj',
			label: t('monthZxfjkchj'),
			component: FieldComponent.FieldSelect,
			tooltips: [
				{
					type: 'text',
					content: '仅支持数字、文本字段',
				},
			],
			props: {
				supportType: [FieldType.Number, FieldType.Text],
			},
			validator: {
				required: false,
			},
		},
		{
			key: 'select',
			label: '注：选择字段越多，计算越精准👉🏻 ',
			tooltips: [
				{
					type: 'link',
					text: '点击了解：如何计算最优年终奖',
					link: 'https://yygongzi.feishu.cn/wiki/X2EEwAEKeizdI8kCNCJcFrdQnX7',
				},
			],
			component: FieldComponent.Radio,
			props: {
				options: [],
			},
			defaultValue: '1',
			validator: {
				required: true,
			},
		},
	],
	// 定义捷径的返回结果类型
	resultType: {
		type: FieldType.Object,
		extra: {
			icon: {
				light: '',
			},
			properties: [
				{
					key: 'bonusInSalary',
					type: FieldType.Text,
					title: '转入工资发放的年终奖',
				},
				{
					key: 'bonusAfter',
					type: FieldType.Text,
					title: '调整后应发的年终奖',
				},
				{
					key: 'salaryTaxAfter',
					type: FieldType.Text,
					title: '调整后的工资缴税（年）',
				},
				{
					key: 'bonusTaxAfter',
					type: FieldType.Text,
					title: '调整后的年终奖繳税',
				},
				{
					key: 'saveTax',
					type: FieldType.Text,
					title: '节省个税',
					primary: true,
					isGroupByKey: true,
				},
			],
		},
	},
	// formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
	execute: async (formItemParams, context) => {
		// 兼容 文本、数组
		const obj = {};
		for (const item in formItemParams) {
			obj[item] =
				typeof formItemParams[item] == 'object'
					? Array.isArray(formItemParams[item])
						? formItemParams[item][0].text
						: formItemParams[item].text
					: formItemParams[item];
		}
		const params = {
			data: [obj],
		};
		try {
			const res = await context
				.fetch(
					'https://www.yygongzi.com/feishuapi/bitable/confirm/generateYeb',
					{
						// 已经在addDomainList中添加为白名单的请求
						method: 'post',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(params),
					}
				)
				.then((res) => res.json());
			const {
				taxSavings = 0,
				bonusTaxAfter = 0,
				salaryTaxAfter = 0,
				bonusInSalary = 0,
				bonusAfter = 0,
			} = res.data?.statements[0];
			const result = {
				bonusInSalary: bonusInSalary,
				bonusAfter: bonusAfter,
				salaryTaxAfter: salaryTaxAfter,
				bonusTaxAfter: bonusTaxAfter,
				saveTax: taxSavings,
			};
			return {
				code: FieldCode.Success,
				data: result,
			};
		} catch (e) {
			return {
				code: FieldCode.Success,
				data: {
					bonusInSalary: 0,
					bonusAfter: 0,
					salaryTaxAfter: 0,
					bonusTaxAfter: 0,
					saveTax: 0,
				},
			};
		}
	},
});
export default basekit;
