// http://118.24.17.156:8082/swagger-ui.html

export const loginApi = '/api/system/login';
export const uptokenApi = '/api/system/common/uptoken';

// 套餐列表
export const combo_list_api = '/api/system/combo/list';
export const combo_detail_api = '/api/system/combo/detail';
export const combo_saveOrUpdate_api = '/api/system/combo/saveOrUpdate';

// 文章列表
export const article_list_api = '/api/minapp/article/list';
export const article_detail_api = '/api/system/article/detail';
export const article_update_api = '/api/system/article/saveOrUpdate';

// 订单
export const order_count_api = '/api/system/order/count'; // 订单条数
export const order_createAlipayQrcode_api = '/api/system/order/createAlipayQrcode'; // 创建支付宝二维码
export const order_exportOrder_api = '/api/system/order/exportOrder'; // 导出订单列表
export const order_list_api = '/api/system/order/list'; // 订单列表
export const order_paySuccess_api = '/api/system/order/paySuccess'; // 订单支付成功
export const order_settlement_api = '/api/system/order/settlement'; // 订单结算
export const order_updateDepositMoney_api = '/api/system/order/updateDepositMoney'; // 押金修改接口
