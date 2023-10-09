
import React from 'react';
import Plot from 'react-plotly.js';

class App extends React.Component {
  render() {
    return (
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        layout={ {width: 320, height: 240, title: 'A Fancy Plot'} }
      />
    );
  }
}



//https://plotly.com/javascript/streaming/
{/* <html>
    <head>
        <script scr="plotly.min.js"></script>
    </head>
    <body>
        <div class="navbar"><span>Real-Time Chart with Plotly.js</span></div>
        <div class="wrapper">

            <div id="chart"></div>
            <script>
                function getData() {
                    return Math.random();
                }
                Plotly.plot('chart', [(
                    y:[getData()], 
                    type:'line'
                )]);
                var cnt = 0;

                setInterval(function(){
                    Plotly.extendTraces('chart', {y: [[getData()]]}, [0])
                    cnt++;
                    if(cnt > 500) {
                        Plotly.relayout('chart', {
                            xasis: {
                                range: [cnt-500, cnt]
                            }
                        })
                    }
                },15);
            </script>
        </div>
    </body>
</html> */}