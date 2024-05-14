import { FormsModule } from '@angular/forms';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-avltree',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './avltree.component.html',
  styleUrl: './avltree.component.css'
})
export class AVLtreeComponent {
  numNodo = 10;
  canvasH = 600;
  canvasW = 1200;
  tree?: AVLtree;
  circleRadius = 20;
  canvas?: HTMLCanvasElement;
  context?: CanvasRenderingContext2D;
  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;

  constructor() {
  }

  generateNode(numNodo: number = this.numNodo): void {
    if (!this.tree || this.tree.isDeleted) {
      this.tree = new AVLtree(numNodo);
    }
    else this.tree.addNode(this.tree, numNodo);
    this.drawCanvas();
  }

  searchNode(): void {
    if (this.tree && !this.tree.isDeleted) {
      if(this.tree.searchNode(this.numNodo)){
        alert('Nodo encontrado');
      }
      else{
        alert('Nodo no encontrado');
      }
    }
  }

  deleteNode(): void {
    if (this.tree && !this.tree.isDeleted) {
      this.tree.deleteNode(this.numNodo);
    }
    this.drawCanvas();
  }

  randomNode(): void {
    this.generateNode(Math.ceil(Math.random() * 100));
  }

  drawCanvas(): void {
    this.context!.clearRect(0, 0, this.canvasW, this.canvasH);
    const max = this.lengthBranchLonger(this.tree);
    this.drawGraph(this.tree!, (max * 50) * 2, this.canvasW / 2, 50);
  }

  ngOnInit(): void {
    this.canvas = this.myCanvas.nativeElement;
    this.context = this.canvas!.getContext('2d')!;
    this.canvas!.width = this.canvasW;
    this.canvas!.height = this.canvasH;
  }

  lengthBranchLonger(node?: AVLtree): number {
    if (!node || node.isDeleted) {
      return 0;
    }
    const lenghtRight = this.lengthBranchLonger(node.right);
    const lenghtLeft = this.lengthBranchLonger(node.left);
    return 1 + Math.max(lenghtRight, lenghtLeft);
  }

  drawGraph(node: AVLtree, max: number, x: number, y: number): void {
    if (node.isDeleted) return;

    this.drawCircle(x, y, node.value, node.weight);
    if (node.right) {
      const xright = x + (max / 2);
      const yright = y + 50;
      if (!node.right.isDeleted) this.drawLine(x, y, xright, yright);
      this.drawGraph(node.right, max / 2, xright, yright);
    }
    if (node.left) {
      const xleft = x - (max / 2);
      const yleft = y + 50;
      if (!node.left.isDeleted) this.drawLine(x, y, xleft, yleft)
      this.drawGraph(node.left, max / 2, xleft, yleft);
    }
  }

  drawLine(x1: number, y1: number, x2: number, y2: number): void {
    if (this.context) {
      this.context.beginPath();
      this.context.moveTo(x1, y1 + this.circleRadius);
      this.context.lineTo(x2, y2 - this.circleRadius);
      this.context.lineWidth = 2;
      this.context.stroke();
    }
  }

  drawCircle(x: number, y: number, text: number, weight: number): void {
    if (this.context) {
      this.context.beginPath();
      this.context.arc(x, y, this.circleRadius, 0, 2 * Math.PI);

      this.context.font = '20px Arial'
      this.context.fillText(text.toString(), x - 10, y + 10)

      this.context.font = '15px Arial'
      this.context.fillText(weight.toString(), x + 15, y - 15)
      this.context.stroke();
    }
  }
}


class AVLtree {
  value: number;
  weight: number;
  isDeleted: boolean;
  left: AVLtree | undefined;
  right: AVLtree | undefined;

  constructor(value: number, left?: AVLtree, right?: AVLtree, weight: number = 0) {
    this.left = left;
    this.right = right;
    this.value = value;
    this.weight = weight;
    this.isDeleted = false;
  }

  isMinors(x: number, y: number): boolean { return x < y }

  addNode(node: AVLtree, value: number): void {
    if (node.isMinors(value, node.value)) this.insertLeft(node, value);
    else this.insertRight(node, value);
  }

  insertLeft(node: AVLtree, value: number): void {
    if (!node.left || node.left.isDeleted) {
      node.left = new AVLtree(value);
    }
    else this.addNode(node.left, value);

    node.weight = this.getWeight(node);
    this.caseRotation(node);
  }

  insertRight(node: AVLtree, value: number): void {
    if (!node.right || node.right.isDeleted) {
      node.right = new AVLtree(value);
    }
    else this.addNode(node.right, value);

    node.weight = this.getWeight(node);
    this.caseRotation(node);
  }

  getWeight(node: AVLtree): number {
    return this.calculateWeight(node.right) - this.calculateWeight(node.left);
  }

  calculateWeight(node?: AVLtree, weight: number = 0): number {
    if (!node || node.isDeleted) return weight;
    const max = Math.max(this.calculateWeight(node.left), this.calculateWeight(node.right));
    return max + 1;
  }

  caseRotation(node: AVLtree): void {
    if (node.weight < -1) {
      if (node.left!.weight < 0) {
        this.updateNode(node, this.rotateRight(node));
      }
      else {
        this.updateNode(node.left!, this.rotateLeft(node.left!));
        this.updateNode(node, this.rotateRight(node));
      }
    }
    else if (node.weight > 1) {
      if (node.right!.weight > 0) {
        this.updateNode(node, this.rotateLeft(node));
      }
      else {
        this.updateNode(node.right!, this.rotateRight(node.right!));
        this.updateNode(node, this.rotateLeft(node));
      }
    }

  }

  rotateRight(node: AVLtree): AVLtree {
    const y = this.nodeCopy(node);
    const x = y.left!;
    const z = x.right;
    x.right = y;
    y.left = z;
    y.weight = this.getWeight(y);
    x.weight = this.getWeight(x);

    return x;
  }

  rotateLeft(node: AVLtree): AVLtree {
    const y = this.nodeCopy(node);
    const x = y.right!;
    const z = x.left;
    x.left = y;
    y.right = z;
    y.weight = this.getWeight(y);
    x.weight = this.getWeight(x);

    return x;
  }

  updateNode(node: AVLtree, newNode: AVLtree): void {
    node.value = newNode.value;
    node.left = newNode.left;
    node.right = newNode.right;
    node.weight = newNode.weight;
  }

  nodeCopy(node: AVLtree): AVLtree {
    return new AVLtree(node.value, node.left, node.right, node.weight)
  }

  searchNode(value: number, node: AVLtree = this): AVLtree | undefined {
    if (value === node.value && !node.isDeleted) return node;

    const nextNodo = value < node.value ? node.left : node.right;
    if (!nextNodo || nextNodo.isDeleted) return undefined;

    return this.searchNode(value, nextNodo);
  }

  deleteNode(value: number): void {
    const node = this.searchNode(value);
    if (node) {
      let numChilds =
        (node.left && !node.left.isDeleted ? 1 : 0) + (node.right && !node.right.isDeleted ? 1 : 0);
      if (numChilds === 0) {
        node.isDeleted = true;
      }
      else if (numChilds === 1) {
        if (node.left && !node.left.isDeleted) {
          this.updateNode(node, node.left);
        }
        else if (!node.right!.isDeleted) {
          this.updateNode(node, node.right!);
        }
      }
      else {
        const newNode = this.getNodeLeft(node.right!);

        newNode.isDeleted = true;
        node.value = newNode.value;

        if (newNode.right){
          newNode.isDeleted = false;
          this.updateNode(newNode, newNode.right);
        }
      }
    }

    this.balanceTree(this);
  }

  balanceTree(node: AVLtree): void {
    node.weight = this.getWeight(node);
    this.caseRotation(node);

    if (node.left && !node.left.isDeleted) {
      this.balanceTree(node.left);
    }
    if (node.right && !node.right.isDeleted) {
      this.balanceTree(node.right);
    }
  }

  getNodeLeft(node: AVLtree): AVLtree {
    if (!node.left || node.left.isDeleted) return node;
    return this.getNodeLeft(node.left);
  }
}
