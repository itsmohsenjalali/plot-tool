const { dialog } = require('electron').remote
const fs = require('fs')
var Chart = require('chart.js');
const notifier = require('node-notifier');

const flag1 = {
    type: 'question',
    buttons: ['a', 'b','c'],
    defaultId: 2,
    title: 'Question',
    message: 'Select The Flag1?',
  };
const flag2 = {
    type: 'question',
    buttons: ['e', 'd','f'],
    defaultId: 2,
    title: 'Question',
    message: 'Select The Flag2?',
  };
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            screen : 1
        }
        this.data = []
        this.selectdata = []
        this.info = []
        this.flagm = false
        this.flaga = false
        this.firstPoint_a = null
        this.secondPoint_a = null
        this.firstPoint_m = null
        this.secondPoint_m = null
    }
    plot = async()=>{
        if(!this.data[0]){
            document.getElementById('status').innerHTML = 'No Data'
            return
        }
        await this.setState({
           screen : 2
         })
         var label = []
         var x_accelerometer = []
         var y_accelerometer = []
         var z_accelerometer = []
         var x_magnetic = []
         var y_magnetic = []
         var z_magnetic = []
         this.data.forEach(row=>{
            row = row.split(',')
            label.push(row[0]);
            x_accelerometer.push(row[1]);
            y_accelerometer.push(row[2]);
            z_accelerometer.push(row[3]);
            x_magnetic.push(row[4]);
            y_magnetic.push(row[5]);
            z_magnetic.push(row[6]);
         })
         var ctx_accelerometer = document.getElementById('accelerometer');
         var ctx_magnetic = document.getElementById('magnetic');
         var accelerometer_Data = {
                 labels: label,
                 datasets: [{
                     label: 'X-Accelerometer',
                     borderColor:'red',
                     backgroundColor:'rgba(255, 99, 132, 0.2)',
                     fill: false,
                     data: x_accelerometer
                 }, {
                     label: 'Y-Accelerometer',
                     borderColor: 'blue',
                     backgroundColor:'rgba(255, 99, 132, 0.2)',
                     fill: false,
                     data: y_accelerometer
                 },{
             label: 'Z-Accelerometer',
                     borderColor: 'yellow',
                     backgroundColor:'rgba(255, 99, 132, 0.2)',
                     fill: false,
                     data: z_accelerometer
           }]
         };
         var magnetic_Data = {
                labels: label,
                 datasets: [{
                     label: 'X-magnetic',
                     borderColor:'red',
                     backgroundColor:'rgba(255, 99, 132, 0.2)',
                     fill: false,
                     data : x_magnetic
                 }, {
                     label: 'Y-magnetic',
                     borderColor: 'blue',
                     backgroundColor:'rgba(255, 99, 132, 0.2)',
                     fill: false,
                     data : y_magnetic
                 },{
                    label: 'Z-magnetic',
                     borderColor: 'yellow',
                     backgroundColor:'rgba(255, 99, 132, 0.2)',
                     fill: false,
                     data : z_magnetic
           }]
         };
         var accelerometer_chart = new Chart.Line(ctx_accelerometer, {
           data: accelerometer_Data,
           options: {
             responsive: true,
             hoverMode: 'index',
             stacked: false,
             title: {
               display: true,
               text: 'Accelerometer Data'
             },
             scales: {
               yAxes: [{
                 type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                 display: true,
                 position: 'left',
                 id: 'y-axis-1',
               }],
             },
            elements: {
                point:{
                    radius: 0
                }
            },
             onClick	: async (evt)=> {
                var f1 = {0:'a',1:'b',2:'c'}
                var f2 = {0:'e',1:'d',2:'f'}
                if(this.flaga){
                    this.secondPoint_a = accelerometer_chart.getElementAtEvent(evt)[0];
                    this.flaga = false
                    var flag_1 = null
                    var flag_2 = null
                    flag_1 = f1[await dialog.showMessageBox(flag1)]
                    flag_2 = f2[await dialog.showMessageBox(flag2)]
                    console.log(flag_1)
                    console.log(flag_2)
                    try {
                        for(var i = this.firstPoint_a._index; i < this.secondPoint_a._index+1 ; i++){
                            var mlabel = magnetic_chart.data.labels[i];
                            var alabel = accelerometer_chart.data.labels[i];
                            var mvalue = []
                            var avalue = []
                            if(mlabel == alabel){
                                magnetic_chart.data.datasets.forEach(row =>{
                                    mvalue.push(row.data[i])
                                })
                                accelerometer_chart.data.datasets.forEach(row=>{
                                    avalue.push(row.data[i])
                                })
                            }
                        this.selectdata.push({
                            timestamp : mlabel,
                            accelerometer_Data : avalue,
                            magnetic_Data : mvalue,
                            first_flag : flag_1,
                            second_flag : flag_2
                        })
                    }
                    } catch (error) {
                        dialog.showErrorBox("Wrong Select","please select point again.");
                        this.firstPoint_a = null
                        this.secondPoint_a = null
                    }
                    console.log('second point')
                }
                else{
                    this.firstPoint_a = accelerometer_chart.getElementAtEvent(evt)[0];
                    this.flaga = true
                    notifier.notify({
                        title: 'Select',
                        message: 'Select First Point.'
                      })
                }
                console.log(this.selectdata)
            }
        }
         });
        
         var magnetic_chart = new Chart.Line(
            ctx_magnetic, {
            data: magnetic_Data,
            options: {
                responsive: true,
                hoverMode: 'index',
                stacked: false,
                title: {
                    display: true,
                    text: 'Magnetic Data'
                },
                scales: {
                    yAxes: [{
                        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: 'left',
                        id: 'y-axis-1',
                    }],
                },
                elements: {
                    point:{
                        radius: 0
                    }
                },
                onClick	:async (evt)=> {
                    var f1 = {0:'a',1:'b',2:'c'}
                    var f2 = {0:'e',1:'d',2:'f'}
                    if(this.flagm){
                        this.secondPoint_m = magnetic_chart.getElementAtEvent(evt)[0];
                        this.flagm = false
                        var flag_1 = null
                        var flag_2 = null
                        flag_1 = f1[await dialog.showMessageBox(flag1)]
                        flag_2 = f2[await dialog.showMessageBox(flag2)]
                        try {
                            for(var i = this.firstPoint_m._index; i < this.secondPoint_m._index+1 ; i++){
                                var mlabel = magnetic_chart.data.labels[i];
                                var alabel = accelerometer_chart.data.labels[i];
                                var mvalue = []
                                var avalue = []
                                if(mlabel == alabel){
                                    magnetic_chart.data.datasets.forEach(row =>{
                                        mvalue.push(row.data[i])
                                    })
                                    accelerometer_chart.data.datasets.forEach(row=>{
                                        avalue.push(row.data[i])
                                    })
                                }
                            this.selectdata.push({
                                timestamp : mlabel,
                                accelerometer_Data : avalue,
                                magnetic_Data : mvalue,
                                first_flag : flag_1,
                                second_flag : flag_2
                            })
                        }
                        } catch (error) {
                            dialog.showErrorBox("Wrong Select","please select point again.");
                            this.firstPoint_m = null
                            this.secondPoint_m = null
                        }
                        
                        console.log('second point')
                    }
                    else{
                        this.firstPoint_m = magnetic_chart.getElementAtEvent(evt)[0];
                        this.flagm = true
                        notifier.notify({
                            title: 'Select',
                            message: 'Select First Point.'
                          })
                    }
                },
                       
            }
        });
        
    }
    
    back = ()=>{
        this.setState({
          screen : 1
        })
    }
    open = () =>{
        var Path = dialog.showOpenDialog({ properties: ['openFile'],
        filters: [{ name: 'CSV', extensions: ['csv'] }] 
        })
        console.log(Path[0])
        fs.readFile(Path[0],(err,data)=>{
            if (err) {
                throw err; 
              }
              this.data = String(data).split("\r\n")
              this.info = this.data[0]
              this.data = this.data.splice(1)
        });
        document.getElementById('status').innerHTML = 'Data Loaded'
    }
    ConvertToCSV = (objArray)=> {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
    
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
    
                line += array[i][index];
                console.log(line)
            }
            // console.log(line)
            
            str += line + '\r\n';
        }
       
        return str;
    };
    finish = ()=>{
        fs.appendFile(`${this.info}.csv`, this.info+'\r\n', function (err) {
            if (err) throw err;
            });
        fs.appendFile(`${this.info}.csv`, this.ConvertToCSV(this.selectdata), function (err) {
            if (err) throw err;
            });
        this.setState({
            screen : 1
        })
    }
    render() {
        if(this.state.screen == 1){
        return (
            <div class="wrapper wrapper--w680">
                <div class="card card-4" >    
                <div class="card-body" id="change-page">
                    <h2 class="title">Der Kellner Analyis Tools</h2>
                    <h4 id = "status"></h4>
                <div class="row row-space">
                    <button onClick={this.open} class="btn btn--radius-2 btn--blue">Open File</button>
                
                    <button onClick={this.plot} class="btn btn--radius-2 btn--blue">Plotting</button>
                </div>
                </div>
                </div>
            </div>
        );
        }
        else if(this.state.screen == 2){
        return(
            <div class="wrapper wrapper--w750">
                <div class="card card-4" >    
                <div class="card-body">
                    <h2 class="title">Der Kellner</h2>
                    <h3>Plotting The Data</h3>
                    <div class="row row-space">
                    <div class="col-3"></div>
                    <canvas id="accelerometer"></canvas>
                    </div>
                    <div class="row row-space">
                    <div class="col-3"></div>
                    <canvas id="magnetic"></canvas>
                    </div>
                    <div class="row row-space">
                    <button onClick={this.back} class="col-4 btn btn--radius-2 btn--blue">Back</button>
                    <button onClick={this.finish} class="col-4 btn btn--radius-2 btn--green">Finish</button>
                    </div>
                </div>
                </div>
            </div>
        );
        }
    }
}
ReactDOM.render(
    <App />,
    document.getElementById('root')
  );