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
basekit.addDomainList(['dev.yygongzi.com']);

basekit.field.name = 33
basekit.addField({
	// 定义捷径的i18n语言资源
	i18n: {
		messages: {
			'zh-CN': {
				bonusBefore: '选择税前年终奖字段',
				salaryBefore: '选择税前工资（月）字段',
				monthSocialInsurance: '选择个人社保公积金合计（月）字段',
				monthZxfjkchj: '选择专项附加扣除合计（月）字段',
			},
			'en-US': {},
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
          content: '必选项，需要选择多维表中「年终奖」列'
        },
      ],
			component: FieldComponent.FieldSelect,
			props: {
				supportType: [FieldType.Number,FieldType.Text],
			},
			validator: {
				required: true,
			},
		},
    {
			key: 'salaryBefore',
			label: t('salaryBefore'),
			component: FieldComponent.FieldSelect,
			props: {
				supportType: [FieldType.Number,FieldType.Text],
			},
			validator: {
				required: false,
			},
		},
    {
			key: 'monthSocialInsurance',
			label: t('monthSocialInsurance'),
			component: FieldComponent.FieldSelect,
			props: {
				supportType: [FieldType.Number,FieldType.Text],
			},
			validator: {
				required: false,
			},
		},
    {
			key: 'monthZxfjkchj',
			label: t('monthZxfjkchj'),
			component: FieldComponent.FieldSelect,
			props: {
			  supportType: [FieldType.Number,FieldType.Text],
			},
			validator: {
				required: true,
			},
		},
    {
			key: 'monthZxfjkchj',
			label: t('monthZxfjkchj'),
			component: FieldComponent.FieldSelect,
			props: {
			  supportType: [FieldType.Number,FieldType.Text],
			},
			validator: {
				required: false,
			},
		},
    {
      key: 'radio',
      label: '批量优化年终奖个税，让员工多拿钱',
      component: FieldComponent.Radio,
      props: {
        defaultValue: "0",
        options: [
        ]
      },
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
          isGroupByKey: true,
          type: FieldType.Text,
          title: '转入工资发放的年终奖',
          primary: true,
          hidden: false,
        },
        {
          key: 'bonusAfter',
          type: FieldType.Text,
          title: '调整后应发的年终奖',
          hidden: false,
        },
        {
          key: 'salaryTaxAfter',
          type: FieldType.Text,
          title: '调整后的工资缴税（年） ',
          hidden: false,
        },
        {
          key: 'bonusTaxAfter',
          type: FieldType.Text,
          title: '调整后的年终奖繳税',
          hidden: false,
        },
        {
          key: 'saveTax',
          type: FieldType.Text,
          title: '节省个税',
          hidden: false,
        },
			],
		},
	},
	// formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
	execute: async (formItemParams, context) => {
    // 兼容 文本、数组
    const obj = {}
    for(const item in formItemParams) {
      obj[item] = typeof formItemParams[item] == 'object' ?
       Array.isArray(formItemParams[item]) ? formItemParams[item][0].text : formItemParams[item].text
       : formItemParams[item]
    }
    const params = {
     data:[obj]
    }
		try {
		  const res = await context.fetch('https://dev.yygongzi.com/feishuapi/bitable/confirm/generateYeb', {
					// 已经在addDomainList中添加为白名单的请求
					method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(params),
				}).then((res) => res.json());
      const { taxSavings = 0, bonusTaxAfter = 0, salaryTaxAfter = 0, bonusInSalary = 0, bonusAfter = 0 } = res.data?.statements[0]
      const result = {
					bonusInSalary: bonusInSalary,
          bonusAfter: bonusAfter,
          salaryTaxAfter: salaryTaxAfter,
          bonusTaxAfter: bonusTaxAfter,
          saveTax: taxSavings
			}
			return {
				code: FieldCode.Success,
				data: result
			};
		} catch (e) {
		   return {
				code: FieldCode.Success,
				data: {
					bonusInSalary: 0,
          bonusAfter: 0,
          salaryTaxAfter: 0,
          bonusTaxAfter: 0,
          saveTax: 0
				},
			};
		}
	},
});
export default basekit;
