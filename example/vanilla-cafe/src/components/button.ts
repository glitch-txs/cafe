import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import { store } from '../store';

@customElement('increment-button')
export class SimpleGreeting extends LitElement {

  increment(){
    store.set.count(p => p + 1)
  }

  // Render the UI as a function of component state
  render() {
    return html`<button @click=${this.increment} >Increment</button>`;
  }
}