"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
// 通过addDomainList添加请求接口的域名
block_basekit_server_api_1.basekit.addDomainList(['dev.yygongzi.com', 'www.yygongzi.com']);
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
                    content: '仅支持数字、文本字段',
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
            tooltips: [
                {
                    type: 'text',
                    content: '仅支持数字、文本字段',
                },
            ],
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
            tooltips: [
                {
                    type: 'text',
                    content: '仅支持数字、文本字段',
                },
            ],
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
            tooltips: [
                {
                    type: 'text',
                    content: '仅支持数字、文本字段',
                },
            ],
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
            tooltips: [
                {
                    type: 'text',
                    content: '仅支持数字、文本字段',
                },
            ],
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Number, block_basekit_server_api_1.FieldType.Text],
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
            component: block_basekit_server_api_1.FieldComponent.Radio,
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
                .fetch('https://www.yygongzi.com/feishuapi/bitable/confirm/generateYeb', {
                // 已经在addDomainList中添加为白名单的请求
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            })
                .then((res) => res.json());
            const { taxSavings = 0, bonusTaxAfter = 0, salaryTaxAfter = 0, bonusInSalary = 0, bonusAfter = 0, } = res.data?.statements[0];
            const result = {
                bonusInSalary: bonusInSalary,
                bonusAfter: bonusAfter,
                salaryTaxAfter: salaryTaxAfter,
                bonusTaxAfter: bonusTaxAfter,
                saveTax: taxSavings,
            };
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: result,
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
                    saveTax: 0,
                },
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFROEM7QUFDOUMsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsMkJBQTJCO0FBQzNCLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0FBRWhFLGtDQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2hCLGdCQUFnQjtJQUNoQixJQUFJLEVBQUU7UUFDTCxRQUFRLEVBQUU7WUFDVCxPQUFPLEVBQUU7Z0JBQ1IsV0FBVyxFQUFFLFdBQVc7Z0JBQ3hCLFlBQVksRUFBRSxhQUFhO2dCQUMzQixvQkFBb0IsRUFBRSxrQkFBa0I7Z0JBQ3hDLGFBQWEsRUFBRSxpQkFBaUI7Z0JBQ2hDLFdBQVcsRUFBRSxvQkFBb0I7Z0JBQ2pDLElBQUksRUFBRSxrQkFBa0I7YUFDeEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1IsV0FBVyxFQUFFLDJDQUEyQztnQkFDeEQsWUFBWSxFQUFFLDJDQUEyQztnQkFDekQsb0JBQW9CLEVBQ25CLDJFQUEyRTtnQkFDNUUsYUFBYSxFQUNaLCtEQUErRDtnQkFDaEUsV0FBVyxFQUNWLDhFQUE4RTtnQkFDL0UsSUFBSSxFQUFFLDZFQUE2RTthQUNuRjtZQUNELE9BQU8sRUFBRSxFQUFFO1NBQ1g7S0FDRDtJQUNELFVBQVU7SUFDVixTQUFTLEVBQUU7UUFDVjtZQUNDLEdBQUcsRUFBRSxhQUFhO1lBQ2xCLEtBQUssRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDO1lBQ3ZCLFFBQVEsRUFBRTtnQkFDVDtvQkFDQyxJQUFJLEVBQUUsTUFBTTtvQkFDWixPQUFPLEVBQUUsWUFBWTtpQkFDckI7YUFDRDtZQUNELFNBQVMsRUFBRSx5Q0FBYyxDQUFDLFdBQVc7WUFDckMsS0FBSyxFQUFFO2dCQUNOLFdBQVcsRUFBRSxDQUFDLG9DQUFTLENBQUMsTUFBTSxFQUFFLG9DQUFTLENBQUMsSUFBSSxDQUFDO2FBQy9DO1lBQ0QsU0FBUyxFQUFFO2dCQUNWLFFBQVEsRUFBRSxJQUFJO2FBQ2Q7U0FDRDtRQUNEO1lBQ0MsR0FBRyxFQUFFLGNBQWM7WUFDbkIsS0FBSyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUM7WUFDeEIsU0FBUyxFQUFFLHlDQUFjLENBQUMsV0FBVztZQUNyQyxRQUFRLEVBQUU7Z0JBQ1Q7b0JBQ0MsSUFBSSxFQUFFLE1BQU07b0JBQ1osT0FBTyxFQUFFLFlBQVk7aUJBQ3JCO2FBQ0Q7WUFDRCxLQUFLLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLENBQUMsb0NBQVMsQ0FBQyxNQUFNLEVBQUUsb0NBQVMsQ0FBQyxJQUFJLENBQUM7YUFDL0M7WUFDRCxTQUFTLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLEtBQUs7YUFDZjtTQUNEO1FBQ0Q7WUFDQyxHQUFHLEVBQUUsc0JBQXNCO1lBQzNCLEtBQUssRUFBRSxDQUFDLENBQUMsc0JBQXNCLENBQUM7WUFDaEMsU0FBUyxFQUFFLHlDQUFjLENBQUMsV0FBVztZQUNyQyxRQUFRLEVBQUU7Z0JBQ1Q7b0JBQ0MsSUFBSSxFQUFFLE1BQU07b0JBQ1osT0FBTyxFQUFFLFlBQVk7aUJBQ3JCO2FBQ0Q7WUFDRCxLQUFLLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLENBQUMsb0NBQVMsQ0FBQyxNQUFNLEVBQUUsb0NBQVMsQ0FBQyxJQUFJLENBQUM7YUFDL0M7WUFDRCxTQUFTLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLEtBQUs7YUFDZjtTQUNEO1FBQ0Q7WUFDQyxHQUFHLEVBQUUsZUFBZTtZQUNwQixLQUFLLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQztZQUN6QixTQUFTLEVBQUUseUNBQWMsQ0FBQyxXQUFXO1lBQ3JDLFFBQVEsRUFBRTtnQkFDVDtvQkFDQyxJQUFJLEVBQUUsTUFBTTtvQkFDWixPQUFPLEVBQUUsWUFBWTtpQkFDckI7YUFDRDtZQUNELEtBQUssRUFBRTtnQkFDTixXQUFXLEVBQUUsQ0FBQyxvQ0FBUyxDQUFDLE1BQU0sRUFBRSxvQ0FBUyxDQUFDLElBQUksQ0FBQzthQUMvQztZQUNELFNBQVMsRUFBRTtnQkFDVixRQUFRLEVBQUUsSUFBSTthQUNkO1NBQ0Q7UUFDRDtZQUNDLEdBQUcsRUFBRSxlQUFlO1lBQ3BCLEtBQUssRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQ3pCLFNBQVMsRUFBRSx5Q0FBYyxDQUFDLFdBQVc7WUFDckMsUUFBUSxFQUFFO2dCQUNUO29CQUNDLElBQUksRUFBRSxNQUFNO29CQUNaLE9BQU8sRUFBRSxZQUFZO2lCQUNyQjthQUNEO1lBQ0QsS0FBSyxFQUFFO2dCQUNOLFdBQVcsRUFBRSxDQUFDLG9DQUFTLENBQUMsTUFBTSxFQUFFLG9DQUFTLENBQUMsSUFBSSxDQUFDO2FBQy9DO1lBQ0QsU0FBUyxFQUFFO2dCQUNWLFFBQVEsRUFBRSxLQUFLO2FBQ2Y7U0FDRDtRQUNEO1lBQ0MsR0FBRyxFQUFFLFFBQVE7WUFDYixLQUFLLEVBQUUscUJBQXFCO1lBQzVCLFFBQVEsRUFBRTtnQkFDVDtvQkFDQyxJQUFJLEVBQUUsTUFBTTtvQkFDWixJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixJQUFJLEVBQUUsNkRBQTZEO2lCQUNuRTthQUNEO1lBQ0QsU0FBUyxFQUFFLHlDQUFjLENBQUMsS0FBSztZQUMvQixLQUFLLEVBQUU7Z0JBQ04sT0FBTyxFQUFFLEVBQUU7YUFDWDtZQUNELFlBQVksRUFBRSxHQUFHO1lBQ2pCLFNBQVMsRUFBRTtnQkFDVixRQUFRLEVBQUUsSUFBSTthQUNkO1NBQ0Q7S0FDRDtJQUNELGNBQWM7SUFDZCxVQUFVLEVBQUU7UUFDWCxJQUFJLEVBQUUsb0NBQVMsQ0FBQyxNQUFNO1FBQ3RCLEtBQUssRUFBRTtZQUNOLElBQUksRUFBRTtnQkFDTCxLQUFLLEVBQUUsRUFBRTthQUNUO1lBQ0QsVUFBVSxFQUFFO2dCQUNYO29CQUNDLEdBQUcsRUFBRSxlQUFlO29CQUNwQixJQUFJLEVBQUUsb0NBQVMsQ0FBQyxJQUFJO29CQUNwQixLQUFLLEVBQUUsWUFBWTtpQkFDbkI7Z0JBQ0Q7b0JBQ0MsR0FBRyxFQUFFLFlBQVk7b0JBQ2pCLElBQUksRUFBRSxvQ0FBUyxDQUFDLElBQUk7b0JBQ3BCLEtBQUssRUFBRSxXQUFXO2lCQUNsQjtnQkFDRDtvQkFDQyxHQUFHLEVBQUUsZ0JBQWdCO29CQUNyQixJQUFJLEVBQUUsb0NBQVMsQ0FBQyxJQUFJO29CQUNwQixLQUFLLEVBQUUsYUFBYTtpQkFDcEI7Z0JBQ0Q7b0JBQ0MsR0FBRyxFQUFFLGVBQWU7b0JBQ3BCLElBQUksRUFBRSxvQ0FBUyxDQUFDLElBQUk7b0JBQ3BCLEtBQUssRUFBRSxXQUFXO2lCQUNsQjtnQkFDRDtvQkFDQyxHQUFHLEVBQUUsU0FBUztvQkFDZCxJQUFJLEVBQUUsb0NBQVMsQ0FBQyxJQUFJO29CQUNwQixLQUFLLEVBQUUsTUFBTTtvQkFDYixPQUFPLEVBQUUsSUFBSTtvQkFDYixZQUFZLEVBQUUsSUFBSTtpQkFDbEI7YUFDRDtTQUNEO0tBQ0Q7SUFDRCwyREFBMkQ7SUFDM0QsT0FBTyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEVBQUU7UUFDMUMsV0FBVztRQUNYLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNmLEtBQUssTUFBTSxJQUFJLElBQUksY0FBYyxFQUFFLENBQUM7WUFDbkMsR0FBRyxDQUFDLElBQUksQ0FBQztnQkFDUixPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxRQUFRO29CQUN0QyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3BDLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTt3QkFDOUIsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJO29CQUM1QixDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFDRCxNQUFNLE1BQU0sR0FBRztZQUNkLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNYLENBQUM7UUFDRixJQUFJLENBQUM7WUFDSixNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU87aUJBQ3ZCLEtBQUssQ0FDTCxnRUFBZ0UsRUFDaEU7Z0JBQ0MsNkJBQTZCO2dCQUM3QixNQUFNLEVBQUUsTUFBTTtnQkFDZCxPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUU7Z0JBQy9DLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQzthQUM1QixDQUNEO2lCQUNBLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDNUIsTUFBTSxFQUNMLFVBQVUsR0FBRyxDQUFDLEVBQ2QsYUFBYSxHQUFHLENBQUMsRUFDakIsY0FBYyxHQUFHLENBQUMsRUFDbEIsYUFBYSxHQUFHLENBQUMsRUFDakIsVUFBVSxHQUFHLENBQUMsR0FDZCxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sTUFBTSxHQUFHO2dCQUNkLGFBQWEsRUFBRSxhQUFhO2dCQUM1QixVQUFVLEVBQUUsVUFBVTtnQkFDdEIsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLGFBQWEsRUFBRSxhQUFhO2dCQUM1QixPQUFPLEVBQUUsVUFBVTthQUNuQixDQUFDO1lBQ0YsT0FBTztnQkFDTixJQUFJLEVBQUUsb0NBQVMsQ0FBQyxPQUFPO2dCQUN2QixJQUFJLEVBQUUsTUFBTTthQUNaLENBQUM7UUFDSCxDQUFDO1FBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNaLE9BQU87Z0JBQ04sSUFBSSxFQUFFLG9DQUFTLENBQUMsT0FBTztnQkFDdkIsSUFBSSxFQUFFO29CQUNMLGFBQWEsRUFBRSxDQUFDO29CQUNoQixVQUFVLEVBQUUsQ0FBQztvQkFDYixjQUFjLEVBQUUsQ0FBQztvQkFDakIsYUFBYSxFQUFFLENBQUM7b0JBQ2hCLE9BQU8sRUFBRSxDQUFDO2lCQUNWO2FBQ0QsQ0FBQztRQUNILENBQUM7SUFDRixDQUFDO0NBQ0QsQ0FBQyxDQUFDO0FBQ0gsa0JBQWUsa0NBQU8sQ0FBQyJ9