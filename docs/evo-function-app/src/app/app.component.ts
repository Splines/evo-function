import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import functionPlot from 'function-plot';
import { linspace } from 'src/util/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'evo-function-app';
  fn: string = 'x * sin(2.4 * x)';

  @ViewChild('plot')
  plotDiv!: ElementRef;

  ngAfterViewInit() {
    this.plotGraph();
  }

  onFunctionChange(event: any) {
    const newFn = event.target.value;
    this.fn = newFn;
    this.plotGraph();
  }

  plotGraph() {
    // --- Plot graph (see https://mauriciopoppe.github.io/function-plot/)
    let width = 800;
    let height = 400;

    // Function & Points
    const xValuesPoints = [0, 4, 9, 12];
    const points = xValuesPoints.map(x => [x, functionPlot.$eval.builtIn({ fn: this.fn }, 'fn', { x })]);

    const xValues = linspace(0, 15, 100);
    const yValues = xValues.map(x => functionPlot.$eval.builtIn({ fn: this.fn }, 'fn', { x }));
    const maxY = Math.max(...yValues);
    const minY = Math.min(...yValues);
    const diffY = maxY - minY;

    // Plot
    functionPlot({
      width,
      height,

      target: this.plotDiv.nativeElement,

      grid: true,
      xAxis: {
        domain: [0, 15]
      },
      yAxis: {
        domain: [minY - 0.1 * diffY, maxY + 0.1 * diffY]
      },

      data: [{
        fn: this.fn,
        range: [0, 15],
        sampler: 'builtIn',
        graphType: 'polyline'
      }, {
        points,
        fnType: 'points',
        graphType: 'scatter',
        attr: {
          r: 4
        }
      }],

      tip: {
        xLine: true,
        yLine: true
      }
    });
  }

}
