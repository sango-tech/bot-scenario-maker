import { IDrawClickedNodeFrom, ILine } from 'src/types';
import Logger from 'src/utils/logger';
import Card from './card';
import LeaderLine from '../plugins/leader-line.min';
import SangoHelper, { uniqBy } from 'src/utils/helper';

export default class MouseDrawer {
  logger = new Logger();
  helper = new SangoHelper();
  container: any;
  cardObjects!: Card[];
  clickedNodeFrom: IDrawClickedNodeFrom | null = null;
  movingLine: any = null;
  drawDoneCallback!: Function;
  private lines: ILine = {};

  constructor(container: any) {
    this.container = container;
  }

  get endMovingNodeId() {
    return 'sgbmk-end-moving-node';
  }

  setCardObjects(cardObjects: Card[]) {
    this.cardObjects = cardObjects;
  }

  setLines(lines: ILine) {
    this.lines = lines;
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

    this.reDrawnAll();
  };

  init = () => {
    this.addMovingNode();
    this.regiterMouseClickEvent();
    return this;
  };

  addMovingLine = (event: MouseEvent) => {
    const fromEl = this.getAnswerNodeEl();
    const toEl = document.getElementById(this.endMovingNodeId);
    if (!fromEl || !toEl) {
      return;
    }

    toEl.style.left = `${event.clientX}px`;
    toEl.style.top = `${event.clientY}px`;

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
        that.handleAnswerNodeClick(event);
        return;
      }

      // Clicked to answer node
      if (target.id.indexOf('card-node') >= 0) {
        that.handleEndNodeClick(event);
        return;
      }

      that.removeDrawingMode();
    });
  };

  handleAnswerNodeClick = (event: MouseEvent) => {
    if (this.clickedNodeFrom) {
      this.removeDrawingMode();
      return;
    }

    const target = event.target as any;
    this.logger.log('Answer node clicked');
    const fromUniqueId = target.getAttribute('data-card-unique-id');
    const fromAnswerId = target.getAttribute('data-answer-id');
    if (!fromUniqueId || !fromAnswerId) {
      return;
    }

    this.setClickedNodeFrom(fromUniqueId, fromAnswerId);
    this.addMovingLine(event);
  };

  // User click to end node to connect answer to next card
  handleEndNodeClick = (event: MouseEvent) => {
    if (!this.clickedNodeFrom) {
      this.handleInitMoveExistLine(event);
      return;
    }

    const endNodeEl = event.target as HTMLElement;
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

  // User click into end line and move to other card or node
  handleInitMoveExistLine = (event: MouseEvent) => {
    const endNodeEl = event.target as HTMLElement;

    const fromUniqueId = endNodeEl.getAttribute('data-from-card-unique-id');
    const fromAnswerId = endNodeEl.getAttribute('data-from-answer-id');
    const lineId = endNodeEl.getAttribute('data-line-id');
    if (!fromUniqueId || !fromAnswerId || !lineId) {
      this.logger.log('Not clicked on end exists line');
      return;
    }

    this.setClickedNodeFrom(fromUniqueId, fromAnswerId);
    this.addMovingLine(event);

    // Remove current line before moving
    const currentLine = this.lines[lineId];
    if (currentLine) {
      currentLine.remove();
    }
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

        answer.nextCards = uniqBy(nextCards, 'uniqueId');
        return answer;
      });

      return cardObject;
    });

    this.reDrawnAll();
    this.removeDrawingMode();
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

  reDrawnAll() {
    if (this.drawDoneCallback) {
      this.drawDoneCallback();
    }
  }
}
