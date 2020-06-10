import 'chrome-extension-async';
import { fromEvent } from 'rxjs';
import '../styles/popup.scss';

const observable = fromEvent(document.getElementById('open-options'), 'click');
observable.subscribe({
    next: () => chrome.tabs.create({ url: '/options.html' }),
});
