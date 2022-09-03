import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { createVuetify } from 'vuetify'
import VxDataTable from '../VxDataTable/VxDataTable.vue'

describe("Simple VxDataTable Test", () => {

  beforeEach(() => {
    const vuetify = createVuetify();
    render(VxDataTable, {
      global: {
        plugins: [vuetify]
      },
      props: {
        title: "My Test Table",
        columns: [
          { text: "Column 1", value: 'column1' },
          { text: "Column 2", value: 'column2' }
        ],
        rows: [
          { column1: 'foo', column2: 'bar' },
          { column1: 'baz', column2: 'boo' },
        ],
        menu: [],
        pagination: true
      }
    })
  })

  it('should render table with a title', () => {
    expect(screen.getByText("My Test Table")).toBeTruthy();
  })

  it('should have 2 columns', () => {
    const { getByText } = screen;
    const headers = screen.getAllByRole("columnheader");

    expect(headers).toHaveLength(2);
    expect(getByText("Column 1")).toBeTruthy();
    expect(getByText("Column 2")).toBeTruthy();
  })

  it('should have 2 rows', () => {
    expect(screen.getByText("1-2 of 2")).toBeTruthy();
  })

  it('should have a menu button', () => {
    expect(screen.getByTitle(/menu/i)).toBeTruthy();
  })

  it('should have a row count selector', () => {
    expect(screen.getByText("Rows per page")).toBeTruthy();
  });

  it('should have pagination buttons', () => {
    expect(screen.getByTitle("Previous Page")).to.include(/button/);
    expect(screen.getByTitle("Next Page")).to.include(/button/);
  });
})
