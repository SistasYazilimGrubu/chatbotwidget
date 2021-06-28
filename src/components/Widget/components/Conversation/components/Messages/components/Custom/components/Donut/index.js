import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from 'react-apexcharts';
import DynamicTable from '../DynamicTable';
import './style.scss';

class Donut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        labels: [],
        series: [],
        plotOptions: {
          pie: {
            donut: {
              size: '65%',
              background: 'transparent',
              labels: {
                show: true,
                value: {
                  formatter(val) {
                    const parts = val.split('.');

                    if (parts[1].length > 2) {
                      const time = `${parts[0]}:${parts[1].slice(0, 2)}:${parts[1].slice(2, 4)}`;
                      return time;
                    }
                    return val;
                  }
                },
                total: {
                  show: true,
                  label: this.getLabels(),
                  color: '#373d3f',
                  formatter: () => this.getSeries()
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: ['#fff']
          },
          enabledOnSeries: undefined
        },
        chart: {
          type: 'donut'
        },
        legend: {
          position: 'bottom',
          width: 350,
          fontSize: '14px'
        },
        tooltip: {
          enabled: false,
          followCursor: true,
          items: {
            display: 'inline-flex'
          },
          style: {
            fontSize: '16px',
            fontFamily: 'Helvetica, Arial'
          }
        },
        responsive: [{
          breakpoint: undefined,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      }
    };
  }

  componentWillMount() {
    const series = [];
    const labels = [];

    this.props.message.chart.map((item) => {
      Object.keys(item).map((itemKey, index) => {
        series[index] = item[itemKey];
        labels[index] = itemKey;
      });
    });

    this.setState(...this.state, this.state.options.labels = labels);
    this.setState(...this.state, this.state.options.series = series);

    if (this.props.message.dateType === 'süre') { // '0:00:00' time gelirse parse et
      series.shift();
      labels.shift();
      this.setState(...this.state, this.state.options.series = this.parseSeries());
    }
  }

    getLabels = () => {
      const labels = [];
      this.props.message.chart.map((item) => {
        Object.keys(item).map((itemKey, index) => {
          labels[index] = itemKey;
        });
      });
      return labels[0];
    }

    getSeries = () => {
      const series = [];
      this.props.message.chart.map((item) => {
        Object.keys(item).map((itemKey, index) => {
          series[index] = item[itemKey];
        });
      });
      return series[0];
    }

    parseSeries() {
      const c = [];
      this.state.options.series.map((item, index) => {
        const a = item.split(':');
        const b = `${a[0]}.${a[1]}`;
        c[index] = parseFloat(b);
      });
      return c;
    }

    render() {
      const { options } = this.state;
      const { message } = this.props;

      return (
        <div>
          {
            message.isVisibleDonut &&
            <div className="donut">
              <Chart options={options} type="donut" series={options.series} width={340} />
            </div>
          }
          <br />
          {
            <DynamicTable message={message} />
          }
        </div>
      );
    }
}

const mapStateToProps = state => ({
  socketUrl: state.behavior.get('socketUrl')
});

export default connect(mapStateToProps)(Donut);
