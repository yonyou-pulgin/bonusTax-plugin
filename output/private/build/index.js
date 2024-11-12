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
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: '转入工资发放的年终奖',
                },
                {
                    key: 'bonusAfter',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: '调整后应发的年终奖',
                },
                {
                    key: 'salaryTaxAfter',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: '调整后的工资缴税（年）',
                },
                {
                    key: 'bonusTaxAfter',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: '调整后的年终奖繳税',
                },
                {
                    key: 'saveTax',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: '节省个税',
                    primary: true,
                    isGroupByKey: true
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