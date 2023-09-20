import numpy as np
import pandas as pd
from flask import Flask, render_template, jsonify

app = Flask(__name__)

history = pd.read_csv('Covid9_data/history.csv')
risk_info = pd.read_csv('Covid9_data/risk_area.csv')
details = pd.read_csv('Covid9_data/details.csv')


@app.route('/')
def index():  # put application's code here
    history.ds = pd.to_datetime(history.ds)
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
    history = history.sort_values('ds')
    g_ym = history.groupby('year_month')
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


@app.route('/get_map_data')
def map_data():
    global details
    pivot_table = pd.pivot_table(details, values='Value', index='Category', aggfunc='sum')
    pivot_table.to_csv('pivot_table.csv')
    return jsonify()


@app.route('/get_tendency_data')
def tendency_data():
    history.ds = pd.to_datetime(history.ds)
    history.set_index('ds', inplace=True)
    data = history['2022-11-01':'2022-12-31']
    dateList = data.index.values
    data_confirm_add = data.confirm_add.values
    data_importCase_add = data.importCase_add.values
    return jsonify({
        'dateList': dateList,
        'data_confirm_add': data_confirm_add,
        'data_importCase_add': data_importCase_add
    })


@app.route('/get_heal_data')
def dead_data():

    return jsonify()


if __name__ == '__main__':
    app.run()
