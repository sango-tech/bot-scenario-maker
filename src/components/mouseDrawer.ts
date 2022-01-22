import { IDrawClickedNodeFrom } from 'src/types';
import Logger from 'src/utils/logger';
import Card from './card';
import LeaderLine from '../plugins/leader-line.min';
import SangoHelper from 'src/utils/helper';

export default class MouseDrawer {
  logger = new Logger();
  helper = new SangoHelper();
  container: any;
  cardObjects!: Card[];
  clickedNodeFrom: IDrawClickedNodeFrom | null = null;
  movingLine: any = null;
  drawDoneCallback!: Function;

  constructor(container: any, cardObjects: Card[]) {
    this.cardObjects = cardObjects;
    this.container = container;
  }

  get endMovingNodeId() {
    return 'sgbmk-end-moving-node';
  }

  setDrawDoneCallback(callback: Function) {
    this.drawDoneCallback = callback;
  }

  getAnswerNodeEl() {
    if (!this.clickedNodeFrom) {
      return;
    }

    const id = `answer-node-${this.clickedNodeFrom.uniqueId}-${this.clickedNodeFrom.answerId}`;
    return document.getElementById(id);
  }

  setClickedNodeFrom = (uniqueId: string, answerId: string) => {
    this.clickedNodeFrom = {
      uniqueId,
      answerId,
    };

    this.logger.log('Clicked node was set to', this.clickedNodeFrom);
  };

  removeDrawingMode = () => {
    this.logger.log('Remove drawing mode');
    this.clickedNodeFrom = null;
    if (this.movingLine) {
      this.movingLine.remove();
      this.movingLine = null;
    }
  };

  init = () => {
    this.addMovingNode();
    this.regiterMouseClickEvent();
    return this;
  };

  addMovingLine = () => {
    const fromEl = this.getAnswerNodeEl();
    const toEl = document.getElementById(this.endMovingNodeId);
    if (!fromEl || !toEl) {
      this.removeDrawingMode();
      return;
    }

    this.movingLine = new LeaderLine(fromEl, toEl);
  };

  addMovingNode = () => {
    const endMoveingNode = document.getElementById(this.endMovingNodeId);
    if (endMoveingNode) {
      return;
    }

    const node = document.createElement('div');
    node.id = this.endMovingNodeId;
    node.classList.add('sgbmk-draw-moving-node');
    this.container.appendChild(node);

    this.regiterMouseMoveLine();
  };

  regiterMouseClickEvent = () => {
    const that = this;
    document.addEventListener('click', function (event) {
      const target = event.target as any;
      if (!target || !target.id) {
        return;
      }

      // Clicked to answer node
      if (target.id.indexOf('answer-node') >= 0) {
        that.handleAnswerNodeClick(target);
        return;
      }

      // Clicked to answer node
      if (target.id.indexOf('card-node') >= 0) {
        that.handleEndNodeClick(event.target as HTMLElement);
      }

      // Remove moving line anyway
      if (that.clickedNodeFrom) {
        that.removeDrawingMode();
      }
    });
  };

  handleAnswerNodeClick = (target: HTMLElement) => {
    if (this.clickedNodeFrom) {
      this.removeDrawingMode();
      return;
    }

    this.logger.log('Answer node clicked');
    // @ts-ignore
    this.setClickedNodeFrom(target.getAttribute('data-card-unique-id'), target.getAttribute('data-answer-id'));
    this.addMovingLine();
  };

  // User click to end node to connect answer to next card
  handleEndNodeClick = (endNodeEl: HTMLElement) => {
    if (!this.clickedNodeFrom) {
      return;
    }

    const nextUniqueId = endNodeEl.getAttribute('data-card-unique-id');
    const nodeIndex = endNodeEl.getAttribute('data-node-index');
    if (!nextUniqueId || !nodeIndex) {
      return;
    }

    this.logger.log(`End node clicked: uniqueId: ${nextUniqueId}, nodeIndex: ${nodeIndex}`);
    if (this.clickedNodeFrom.uniqueId === nextUniqueId) {
      this.logger.log('Clicked to the same card, skipped');
      return;
    }

    this.onDrawDone(nextUniqueId, parseInt(nodeIndex));
  };

  onDrawDone = (nextUniqueId: string, nodeIndex: number) => {
    this.cardObjects.map((cardObject) => {
      if (cardObject.uniqueId !== this.clickedNodeFrom?.uniqueId) {
        return cardObject;
      }

      cardObject.card.answers.map((answer) => {
        if (answer.id !== this.clickedNodeFrom?.answerId) {
          return answer;
        }

        const nextCards = answer.nextCards || [];
        nextCards.unshift({
          uniqueId: nextUniqueId,
          nodeIndex: nodeIndex,
        });

        answer.nextCards = this.helper.uniqBy(nextCards, 'uniqueId');
        return answer;
      });

      return cardObject;
    });

    if (this.drawDoneCallback) {
      this.drawDoneCallback();
    }
  };

  getClickedFromCardObject = () => {
    return this.cardObjects.find((item) => item.uniqueId === this.clickedNodeFrom?.uniqueId);
  };

  regiterMouseMoveLine = () => {
    const endMoveingNode = document.getElementById(this.endMovingNodeId);
    document.addEventListener('mousemove', (e) => {
      if (!this.movingLine || !endMoveingNode || !this.clickedNodeFrom) {
        return;
      }

      endMoveingNode.style.cssText = `left: ${e.clientX}px; top:  ${e.clientY}px;`;
      this.movingLine.position();
    });
  };
}
