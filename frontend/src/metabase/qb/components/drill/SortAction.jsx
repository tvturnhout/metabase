/* @flow */

import Query from "metabase/lib/query";
import StructuredQuery from "metabase-lib/lib/queries/StructuredQuery";
import { t } from "c-3po";
import type {
  ClickAction,
  ClickActionProps,
} from "metabase/meta/types/Visualization";

export default ({ question, clicked }: ClickActionProps): ClickAction[] => {
  const query = question.query();
  if (!(query instanceof StructuredQuery)) {
    return [];
  }

  if (
    !clicked ||
    !clicked.column ||
    clicked.value !== undefined ||
    !clicked.column.source
  ) {
    return [];
  }
  const { column } = clicked;

  const fieldRef = query.fieldReferenceForColumn(column);
  if (!fieldRef) {
    return [];
  }

  const [sortFieldRef, sortDirection] = query.sorts()[0] || [];
  const isAlreadySorted =
    sortFieldRef != null && Query.isSameField(sortFieldRef, fieldRef);

  const actions = [];
  if (
    !isAlreadySorted ||
    sortDirection === "descending" ||
    sortDirection === "desc"
  ) {
    actions.push({
      name: "sort-ascending",
      section: "sort",
      title: t`Ascending`,
      question: () => query.replaceSort([fieldRef, "ascending"]).question(),
    });
  }
  if (
    !isAlreadySorted ||
    sortDirection === "ascending" ||
    sortDirection === "asc"
  ) {
    actions.push({
      name: "sort-descending",
      section: "sort",
      title: t`Descending`,
      question: () => query.replaceSort([fieldRef, "descending"]).question(),
    });
  }
  return actions;
};
