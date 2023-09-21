import numpy as np
import pandas as pd
from flask import Flask, render_template, jsonify

app = Flask(__name__)

history = pd.read_csv('Covid9_data/history.csv')
history.ds = pd.to_datetime(history.ds)
risk_info = pd.read_csv('Covid9_data/risk_area.csv')
details = pd.read_csv('Covid9_data/details.csv')


@app.route('/')
def index():  # put application's code here
    max_date = history.ds.max()
    mask = history.ds == max_date
    cols = ['confirm_add', 'heal_add', 'confirm_now', 'confirm']
    data = history.loc[mask, cols]
    tdict = dict(zip(cols, data.values[0]))
    return render_template('index.html', today=tdict)


@app.route('/get_risk_info')
def get_risk_info():
    max_date = risk_info.end_update_time.max()
    mask = risk_info.end_update_time == max_date
    data = risk_info.loc[mask, 'province':]
    risk = data.type.tolist()

    # 统计高低风险地区数量
    value_num = data.type.value_counts()
    high_num = int(value_num['高风险'])
    low_num = int(value_num['低风险'])

    data = data.drop('type', axis=1)
    detail = data.apply(lambda x: '\t'.join(x), axis=1)
    return jsonify({
        'details': detail.tolist(),
        'risk': risk,
        'update_time': max_date,
        'risk_num': {'high_num': high_num, 'low_num': low_num}
    })


@app.route('/get_top5')
def top5():
    details.update_time = pd.to_datetime(details.update_time)
    max_date = details.update_time.max()
    mask = details.update_time == max_date
    data = details.loc[mask, ['province', 'confirm_now']]
    data = data.sort_values('confirm_now', ascending=False)

    data = data.iloc[2:7]
    cityList = data.province.tolist()
    cityData = data.confirm_now.tolist()
    return jsonify({
        'cityList': cityList,
        'cityData': cityData
    })


@app.route('/get_heal_dead')
def heal_dead():
    global history  # 在函数内部对全局变量进行重新赋值
    history['year_month'] = history.ds.dt.to_period('M')
    g_ym = history.sort_values('ds')
    g_ym = g_ym.groupby('year_month')
    dateList = g_ym.groups.keys()
    dateList = list(map(str, dateList))
    # 新增趋势：每个月份的所有新增数据总和
    deadAdd = g_ym['dead_add'].sum().tolist()
    healAdd = g_ym['heal_add'].sum().tolist()
    # 总体趋势：获取每个月份最后一天的数据
    indices = [g_ym.groups[key][-1] for key in g_ym.groups]
    dead = history.loc[indices, 'dead'].tolist()
    heal = history.loc[indices, 'heal'].tolist()
    return jsonify({
        'dateList': dateList,
        'addData': {
            'healAdd': healAdd,
            'deadAdd': deadAdd
        },
        'sumData': {
            'dead': dead,
            'heal': heal
        }
    })


@app.route('/get_province_data')
def province_data():
    global details
    details = details.sort_values('update_time')
    details_province = details.groupby('province')
    data = details_province.apply(lambda x: x.tail(1))['confirm']
    data_confirm = [
        {'name': '0 - 100', 'value': 0},
        {'name': '100 - 1000', 'value': 0},
        {'name': '1000 - 10000', 'value': 0},
        {'name': '10000+', 'value': 0}
    ]
    for confirm in data.values:
        if confirm < 100:
            data_confirm[0]['value'] += 1
        elif confirm < 1000:
            data_confirm[1]['value'] += 1
        elif confirm < 10000:
            data_confirm[2]['value'] += 1
        else:
            data_confirm[3]['value'] += 1
    print(data_confirm)
    return jsonify({
        'data_confirm': data_confirm
    })


# @app.route('/get_map_data')
# def map_data():
#     # details.update_time = pd.to_datetime(details.update_time)
#     details['year_month'] = details.update_time.dt.to_period('M')
#     data = details.groupby(['year_month', 'province']).apply(lambda x: x.confirm_add.sum())
#     year_month = np.unique(details.year_month)
#     province = np.unique(details.province)
#     confirm_add = []
#     for item in year_month:
#         confirm_add.append(data.loc[item].values.tolist())
#     return jsonify({
#         'year_month': year_month.tolist(),
#         'province': province.tolist(),
#         'confirm_add': confirm_add
#     })

@app.route('/get_map_data')
def map_data():
    # details.update_time = pd.to_datetime(details.update_time)
    details['year_month'] = details.update_time.dt.to_period('M')
    data = details.groupby(['year_month', 'province']).apply(lambda x: x.confirm_add.sum())
    year_month = np.unique(details.year_month)
    province = np.unique(details.province)
    confirm_add = []
    for item in year_month:
        confirm_add.append(data.loc[item].values.tolist())
    year_month = np.vectorize(lambda x: x.strftime('%Y-%m'))(year_month)
    return jsonify({
        'year_month': year_month.tolist(),
        'province': province.tolist(),
        'confirm_add': confirm_add
    })


@app.route('/get_dead_ratio')
def get_dead_ratio():
    # global details
    # details = details.sort_values('update_time')
    # details_province = details.groupby('province')

    details.update_time = pd.to_datetime(details.update_time)
    max_date = details.update_time.max()
    mask = details.update_time == max_date
    data = details.loc[mask, ['province', 'confirm', 'dead']]

    # 按照'province'列分类，求和'confirm'和'dead'列的数据
    result = data.groupby('province').sum().reset_index()

    # 计算'ratio'列
    result['ratio'] = result['dead'] / result['confirm']

    # 计算'ratio'列的总和
    ratio_sum = result['ratio'].sum()

    # 计算'ratio_ratio'列
    result['ratio_ratio'] = result['ratio'] / ratio_sum

    # 将结果转换为字典形式
    result_dict = result.to_dict('list')


    max_date = history.ds.max()
    mask = history.ds == max_date
    history_data = history.loc[mask, ['dead','confirm']]
    history_data['ratio'] = history_data['dead'] / history_data['confirm']
    print(history_data['ratio'])
    history_data_dict = history_data.to_dict('list')


    return jsonify({
        'province': result_dict['province'],
        'dead': result_dict['dead'],
        'confirm': result_dict['confirm'],
        'ratio': result_dict['ratio'],
        'ratio_ratio': result_dict['ratio_ratio'],
        'history_dead': history_data_dict['dead'],
        'history_confirm': history_data_dict['confirm'],
        'history_ratio': history_data_dict['ratio']
    })


@app.route('/get_tendency_data')
def tendency_data():
    data = history.copy()
    data.set_index('ds', inplace=True)
    data = data['2022-11-01':'2022-12-31']
    dateList = data.index.strftime("%Y-%m-%d").values
    data_confirm_add = data.confirm_add.values
    data_importedCase_add = data.importedCase_add.values
    return jsonify({
        'dateList': dateList.tolist(),
        'data_confirm_add': data_confirm_add.tolist(),
        'data_importedCase_add': data_importedCase_add.tolist()
    })


if __name__ == '__main__':
    app.run()
