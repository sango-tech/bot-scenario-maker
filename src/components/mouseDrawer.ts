import { IDrawClickedNodeFrom } from 'src/types';
import Logger from 'src/utils/logger';
import Card from './card';
import LeaderLine from '../plugins/leader-line.min';

export default class MouseDrawer {
  logger = new Logger();
  container: any;
  cardObjects!: Card[];
  clickedNodeFrom: IDrawClickedNodeFrom | null = null;
  movingLine: any = null;

  constructor(container: any, cardObjects: Card[]) {
    this.cardObjects = cardObjects;
    this.container = container;
  }

  get endMovingNodeId() {
    return 'sgbmk-end-moving-node';
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
    const that = this;
    this.addMovingNode();

    const elements = document.getElementsByClassName('sgbmk__card__answers__item__node');
    Array.from(elements).forEach(function(element) {
      element.addEventListener('click', function() {
        that.logger.log('Answer node clicked');
        // @ts-ignore
        that.setClickedNodeFrom(this.getAttribute('data-card-unique-id'), this.getAttribute('data-answer-id'));
        that.addMovingLine();
      });
    });

    this.regiterReleaseDrawingMode();
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

  regiterReleaseDrawingMode = () => {
    const that = this;
    document.addEventListener('click', function(event) {
      const target = event.target as any;
      if (target && target.id && target.id.indexOf('node') > 0) {
        return;
      }

      if (that.clickedNodeFrom) {
        that.removeDrawingMode();
      }
    });
  };

  regiterMouseMoveLine = () => {
    const endMoveingNode = document.getElementById(this.endMovingNodeId);
    document.addEventListener('mousemove', (e) => {
      if (!this.movingLine || !endMoveingNode || !this.clickedNodeFrom) {
        return;
      }

      endMoveingNode.style.cssText = `left: ${e.clientX}px; top:  ${e.clientY + 10}px;`;
      this.movingLine.position();
    });
  };
}
