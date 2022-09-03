import { describe, test, expect, beforeEach } from 'vitest'
import { useSort } from '../VxDataTable/sort' 

describe("sort composable tests", () => {

  test('usesort', () => {
    const { DIR, getSortFn } = useSort();
    const data = [
      { value: "crab" },
      { value: "baby" },
      { value: "eagle" },
      { value: "apple" },
      { value: "daddy" },
      { value: "farm" }
    ]
    const asc = [...data].sort(getSortFn("value", DIR.ASC))
    const desc = [...data].sort(getSortFn("value", DIR.DESC))
    const none = [...data].sort(getSortFn("value", DIR.NONE))

    /** ASC */
    expect(asc[0].value).toEqual("apple")
    expect(asc[1].value).toEqual("baby")
    expect(asc[2].value).toEqual("crab")
    expect(asc[3].value).toEqual("daddy")
    expect(asc[4].value).toEqual("eagle")
    expect(asc[5].value).toEqual("farm")

    /** DESC */
    expect(desc[0].value).toEqual("farm")
    expect(desc[1].value).toEqual("eagle")
    expect(desc[2].value).toEqual("daddy")
    expect(desc[3].value).toEqual("crab")
    expect(desc[4].value).toEqual("baby")
    expect(desc[5].value).toEqual("apple")

    /** NONE */
    expect(none).toStrictEqual(data);
  })
})