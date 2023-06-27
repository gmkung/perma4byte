await SmartWeave.contracts.write(action.input.to, {
    function: "relay",
    query: [action.input.params.jobID, action.input.params, { height: 180 }],
  })
  return { state }