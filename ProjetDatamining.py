import numpy as np
import pandas as pd
from flask_restful import Api
from flask_cors import CORS
from scipy.stats import poisson
from flask import Flask, jsonify, request
from sklearn.externals import joblib

app = Flask(__name__)
CORS(app)
filename = 'finalized_model.sav'
poisson_model = joblib.load(filename)
def get(foot_model, homeTeam, awayTeam, max_goals=10):
        home_goals_avg = foot_model.predict(pd.DataFrame(data={'team': homeTeam,
                                                                'opponent': awayTeam,'home':1},
                                                          index=[1])).values[0]
        away_goals_avg = foot_model.predict(pd.DataFrame(data={'team': awayTeam,
                                                                'opponent': homeTeam,'home':0},
                                                          index=[1])).values[0]
        team_pred = [[poisson.pmf(i, team_avg) for i in range(0, max_goals+1)] for team_avg in [home_goals_avg, away_goals_avg]]
        return(np.outer(np.array(team_pred[0]), np.array(team_pred[1])))


@app.route('/result', methods=['GET'])
def get_tasks():
    hc = request.args.get('HT')
    at = request.args.get('AT')
    print(hc)
    tun_eng = get(poisson_model, hc, at)
    x = np.matrix(tun_eng)
    data = [{"home": str(np.sum(np.tril(tun_eng, -1))),
             "draw": str(np.sum(np.diag(tun_eng))),
             "away": str(np.sum(np.triu(tun_eng, 1)))}]
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
# api.add_resource()