import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import functionPlot from 'function-plot';
import { Evolution, GeneWithCost } from 'src/evo/evolution';
import { Problem } from 'src/evo/problem';
import { linspace } from 'src/util/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'evo-function-app';
  // fn: string = 'x * sin(2.4 * x)';
  fn: string = 'x + 4 * sin(x)';
  log: string = 'test';
  evo!: Evolution; // initialized in initEvolution()
  generation: GeneWithCost[] = [];

  @ViewChild('plot')
  plotDiv!: ElementRef;

  constructor() {
    this.initEvolution();
  }

  ngAfterViewInit() {
    this.plotGraph();
  }

  private initEvolution() {
    const problem = new Problem(x => this.evalFn(x));
    this.evo = new Evolution(4, 4, problem);
  }

  onFunctionChange(event: any) {
    this.initEvolution();
    const newFn = event.target.value;
    this.fn = newFn;
    this.plotGraph();
  }

  private evalFn(x: number) {
    return functionPlot.$eval.builtIn({ fn: this.fn }, 'fn', { x });
  }

  plotGraph() {
    // --- Plot graph (see https://mauriciopoppe.github.io/function-plot/)
    let width = 800;
    let height = 400;

    // Function & Points
    const xEvolutionPoints = this.generation.map(x => x.gene.toInt());
    const evolutionPoints = xEvolutionPoints.map(x => [x, this.evalFn(x)]);
    // console.log(`Evolution points: ${evolutionPoints}`);

    const xValues = linspace(0, 15, 100);
    const yValues = xValues.map(x => this.evalFn(x));
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
        domain: [-1, 16]
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
        points: evolutionPoints,
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

  nextStep() {
    this.generation = this.evo.next();
    this.plotGraph();
  }

  writeToLog(append: string) {
    this.log += append;
  }

}
