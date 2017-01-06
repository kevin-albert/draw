import { ImgFailUiPage } from './app.po';

describe('img-fail-ui App', function() {
  let page: ImgFailUiPage;

  beforeEach(() => {
    page = new ImgFailUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
