import { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import BarChartY from './barreY.jsx';
class Camembert extends Component {
    state = {  } 
    render() { 
        return (
            <div>
                <h1>camembert</h1>
                <Doughnut data={{
            labels: ['Red', 'Blue', 'Yellow'],
            datasets: [
              {
                label: '# of Votes',
                data: [this.props.var1, this.props.var2, this.props.var3],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
              },
            ],
          }} />
                      <div >
              <h1>données en bar du camembert</h1>
              <BarChartY var1={this.props.var1} var2={this.props.var2} var3={this.props.var3} />
            </div>
            </div>
            
        );
    }
}
 
export default Camembert;