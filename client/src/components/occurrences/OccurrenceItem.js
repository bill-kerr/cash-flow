import React, { useState } from "react";
import { connect } from "react-redux";
import { formatCurrency } from "../../util";
import { createException } from "../../actions/exceptions";
import { fetchOccurrences } from "../../actions/occurrences";
import TransactionBadge from "../TransactionBadge";
import OccurrenceActions from "./OccurrenceActions";
import OccurrenceActionStatus from "./OccurrenceActionStatus";
import OccurrenceEditPanel from "./OccurrenceEditPanel";

const OccurrenceItem = ({
  occurrence,
  balance,
  currencyCode,
  createException,
  fetchOccurrences,
  rowSpacing = "normal",
}) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("default");

  const onDelete = async () => {
    setStatus("Deleting occurrence...");

    const exception = {
      scheduleId: occurrence.schedule,
      occurrenceDeleted: true,
      date: occurrence.originalDate,
    };

    createException(exception)
      .then(async (res) => {
        await fetchOccurrences();
        setStatus("default");
      })
      .catch((error) => {
        // TODO: handle error
        setStatus("default");
      });
  };

  const onMoveDate = async (newDate) => {
    setStatus(`Moving occurrence to ${newDate}...`);

    const exception = {
      scheduleId: occurrence.schedule,
      occurrenceDeleted: false,
      date: occurrence.originalDate,
      currentDate: newDate,
    };

    createException(exception)
      .then(async () => {
        await fetchOccurrences();
        setStatus("default");
      })
      .catch((error) => {
        // TODO: handle error.
        setStatus("default");
      });
  };

  const onEdit = () => {
    setStatus(status === "edit" ? "default" : "edit");
  };

  const renderActions = () => {
    return isActive ? (
      <OccurrenceActions onDelete={onDelete} onMoveDate={onMoveDate} onEdit={onEdit} date={occurrence.date} />
    ) : null;
  };

  const spacing = {
    tight: "py-2",
    normal: "py-3",
    loose: "py-4",
  }[rowSpacing];

  return (
    <div
      className={`
        ${isActive ? "bg-gray-300" : "even:bg-gray-200"}
        ${balance < 0 ? "text-red-800 font-bold" : ""}
        `}
      onMouseOver={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <div className="relative flex text-sm">
        <div className={`w-1/6 ${spacing} pl-4 whitespace-no-wrap`}>{occurrence.currentDate}</div>
        <div className={`flex-grow ${spacing} pl-2 whitespace-no-wrap`}>{occurrence.description}</div>
        <div className={`w-1/12 ${spacing} pl-2 whitespace-no-wrap flex justify-end`}>
          <TransactionBadge
            amount={occurrence.amount}
            currencyCode={currencyCode}
            bold={false}
            positiveTextStyle="text-green-800"
            negativeTextStyle="text-red-800"
          />
        </div>
        <div className={`w-1/12 ${spacing} pl-2 whitespace-no-wrap text-right`}>
          {formatCurrency(balance, currencyCode)}
        </div>
        <div
          className={`w-1/5 ${spacing} pl-2 pr-4 my-auto whitespace-no-wrap text-right flex items-center justify-end`}
        >
          {renderActions()}
        </div>
        {status !== "default" && status !== "edit" ? <OccurrenceActionStatus status={status} /> : null}
      </div>
      <OccurrenceEditPanel showPanel={status === "edit"} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currencyCode: state.settings.currencyCode,
  };
};

export default connect(mapStateToProps, { createException, fetchOccurrences })(OccurrenceItem);
