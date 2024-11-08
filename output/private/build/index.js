"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
// 通过addDomainList添加请求接口的域名
block_basekit_server_api_1.basekit.addDomainList(['dev.yygongzi.com']);
block_basekit_server_api_1.basekit.addField({
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
                monthSocialInsurance: 'select field of total personal social security and housing fund (monthly)',
                monthZxfjkchj: 'select field of total special additional deductions (monthly)',
                requireDesc: 'required option, you need to select the "year-end bonus" column in the table',
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
                    content: t('requireDesc')
                },
            ],
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Number, block_basekit_server_api_1.FieldType.Text],
            },
            validator: {
                required: true,
            },
        },
        {
            key: 'salaryBefore',
            label: t('salaryBefore'),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Number, block_basekit_server_api_1.FieldType.Text],
            },
            validator: {
                required: false,
            },
        },
        {
            key: 'monthSocialInsurance',
            label: t('monthSocialInsurance'),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Number, block_basekit_server_api_1.FieldType.Text],
            },
            validator: {
                required: false,
            },
        },
        {
            key: 'monthZxfjkchj',
            label: t('monthZxfjkchj'),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Number, block_basekit_server_api_1.FieldType.Text],
            },
            validator: {
                required: true,
            },
        },
        {
            key: 'monthZxfjkchj',
            label: t('monthZxfjkchj'),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Number, block_basekit_server_api_1.FieldType.Text],
            },
            validator: {
                required: false,
            },
        },
        {
            key: 'radio',
            label: t('desc'),
            component: block_basekit_server_api_1.FieldComponent.Radio,
            props: {
                defaultValue: "0",
                options: []
            },
            validator: {
                required: false,
            },
        },
    ],
    // 定义捷径的返回结果类型
    resultType: {
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: {
                light: '',
            },
            properties: [
                {
                    key: 'bonusInSalary',
                    isGroupByKey: true,
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: '转入工资发放的年终奖',
                    primary: true,
                    hidden: false,
                },
                {
                    key: 'bonusAfter',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: '调整后应发的年终奖',
                    hidden: false,
                },
                {
                    key: 'salaryTaxAfter',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: '调整后的工资缴税（年） ',
                    hidden: false,
                },
                {
                    key: 'bonusTaxAfter',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: '调整后的年终奖繳税',
                    hidden: false,
                },
                {
                    key: 'saveTax',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: '节省个税',
                    hidden: false,
                },
            ],
        },
    },
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
    execute: async (formItemParams, context) => {
        // 兼容 文本、数组
        const obj = {};
        for (const item in formItemParams) {
            obj[item] = typeof formItemParams[item] == 'object' ?
                Array.isArray(formItemParams[item]) ? formItemParams[item][0].text : formItemParams[item].text
                : formItemParams[item];
        }
        const params = {
            data: [obj]
        };
        try {
            const res = await context.fetch('https://dev.yygongzi.com/feishuapi/bitable/confirm/generateYeb', {
                // 已经在addDomainList中添加为白名单的请求
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            }).then((res) => res.json());
            const { taxSavings = 0, bonusTaxAfter = 0, salaryTaxAfter = 0, bonusInSalary = 0, bonusAfter = 0 } = res.data?.statements[0];
            const result = {
                bonusInSalary: bonusInSalary,
                bonusAfter: bonusAfter,
                salaryTaxAfter: salaryTaxAfter,
                bonusTaxAfter: bonusTaxAfter,
                saveTax: taxSavings
            };
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: result
            };
        }
        catch (e) {
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
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
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFROEM7QUFDOUMsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsMkJBQTJCO0FBQzNCLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0FBRTVDLGtDQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2hCLGdCQUFnQjtJQUNoQixJQUFJLEVBQUU7UUFDTCxRQUFRLEVBQUU7WUFDVCxPQUFPLEVBQUU7Z0JBQ1IsV0FBVyxFQUFFLFdBQVc7Z0JBQ3hCLFlBQVksRUFBRSxhQUFhO2dCQUMzQixvQkFBb0IsRUFBRSxrQkFBa0I7Z0JBQ3hDLGFBQWEsRUFBRSxpQkFBaUI7Z0JBQzVCLFdBQVcsRUFBRSxvQkFBb0I7Z0JBQ2pDLElBQUksRUFBRSxrQkFBa0I7YUFDNUI7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsV0FBVyxFQUFFLDJDQUEyQztnQkFDM0QsWUFBWSxFQUFFLDJDQUEyQztnQkFDekQsb0JBQW9CLEVBQUUsMkVBQTJFO2dCQUNqRyxhQUFhLEVBQUUsK0RBQStEO2dCQUMxRSxXQUFXLEVBQUUsOEVBQThFO2dCQUMzRixJQUFJLEVBQUUsNkVBQTZFO2FBQ3BGO1lBQ0osT0FBTyxFQUFFLEVBQUU7U0FDWDtLQUNEO0lBQ0QsVUFBVTtJQUNWLFNBQVMsRUFBRTtRQUNWO1lBQ0MsR0FBRyxFQUFFLGFBQWE7WUFDbEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDbkIsUUFBUSxFQUFFO2dCQUNUO29CQUNFLElBQUksRUFBRSxNQUFNO29CQUNaLE9BQU8sRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDO2lCQUMxQjthQUNGO1lBQ0osU0FBUyxFQUFFLHlDQUFjLENBQUMsV0FBVztZQUNyQyxLQUFLLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLENB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