import { PersonalfirestoreappPage } from './app.po';

describe('personalfirestoreapp App', () => {
  let page: PersonalfirestoreappPage;

  beforeEach(() => {
    page = new PersonalfirestoreappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
