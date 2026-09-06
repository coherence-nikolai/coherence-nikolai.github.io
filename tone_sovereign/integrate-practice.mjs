// Creator-approved three-step practice, 6 September 2026. Stable IDs are the
// saved meaning; localized labels are never parsed back into an interpretation.
export const INTEGRATE_OPTIONS = Object.freeze({
  signal: [['bodySignal', "The body's signal", 'La señal del cuerpo'], ['feeling', 'A feeling', 'Un sentimiento'], ['otherPerspective', 'Another perspective', 'Otra perspectiva']],
  limit: [['practicalLimit', 'A practical limit', 'Un límite práctico'], ['safetyNeed', 'A safety need', 'Una necesidad de seguridad'], ['noneToAdd', 'No additional limit', 'Ningún límite adicional']],
  authority: [['fear', 'Fear', 'Miedo'], ['urgency', 'Urgency', 'Urgencia'], ['familiarStory', 'A familiar story', 'Una historia conocida'], ['othersDemand', "Another person's demand", 'La exigencia de otra persona'], ['pleasing', 'The need to please', 'La necesidad de complacer'], ['nothingTakingOver', 'Nothing is taking over', 'Nada está tomando el control']],
  response: [['protectBoundary', 'Protect the boundary', 'Protege el límite'], ['seekSupport', 'Seek support', 'Busca apoyo'], ['considerRepair', 'Consider a repair', 'Considera reparar algo'], ['restBeforeActing', 'Rest before acting', 'Descansa antes de actuar'], ['safeStep', 'Take one safe step', 'Da un paso seguro'], ['finishHere', 'Finish here', 'Terminar aquí']]
});
const has = (group, id) => INTEGRATE_OPTIONS[group].some(option => option[0] === id);
export const INTEGRATE_GUIDANCE = Object.freeze({
  cue: 'ts_integrate_decentre_v1',
  en: "What should not make the whole choice by itself? Fear, urgency, a familiar story, or another person's demand can be noticed without being placed in command. Let each signal be heard. Then decide what deserves authority over the whole response.",
  es: '¿Qué no debería decidir por sí solo toda la elección? El miedo, la urgencia, una historia conocida o la exigencia de otra persona pueden reconocerse sin quedar al mando. Deja que cada señal sea escuchada. Después, decide qué merece autoridad sobre la respuesta completa.'
});
export const newIntegrate = () => ({inclusionDecision: 'unchosen', signals: [], limitDecision: 'unchosen', notSoleAuthority: 'unchosen', response: 'unchosen'});
export function chooseIntegrate(current, group, id) {
  const value = {...current, signals: [...current.signals]};
  if (group === 'nothing' && id === 'nothingMore') {
    const clear = value.inclusionDecision === 'nothingMore';
    value.inclusionDecision = clear ? 'unchosen' : 'nothingMore'; value.signals = []; value.limitDecision = clear ? 'unchosen' : 'noneToAdd';
  } else if (group === 'signal' && has(group, id)) {
    if (value.signals.includes(id)) value.signals = value.signals.filter(item => item !== id);
    else if (value.signals.length < 2) value.signals.push(id);
    else return {value: current, limitReached: true};
    if (value.inclusionDecision === 'nothingMore') value.limitDecision = 'unchosen';
    value.inclusionDecision = value.signals.length || ['practicalLimit', 'safetyNeed'].includes(value.limitDecision) ? 'include' : 'unchosen';
  } else if (group === 'limit' && has(group, id)) {
    value.limitDecision = value.inclusionDecision !== 'nothingMore' && value.limitDecision === id ? 'unchosen' : id;
    value.inclusionDecision = value.signals.length || ['practicalLimit', 'safetyNeed'].includes(value.limitDecision) ? 'include' : 'unchosen';
  } else if (group === 'authority' && has(group, id)) value.notSoleAuthority = id;
  else if (group === 'response' && has(group, id)) value.response = id;
  return {value, limitReached: false};
}
export function integrateStepValid(value, step) {
  if (!value) return false;
  if (step === 0) return value.inclusionDecision === 'nothingMore' || (value.inclusionDecision === 'include' && (value.signals.length > 0 || ['practicalLimit', 'safetyNeed'].includes(value.limitDecision)));
  if (step === 1) return has('authority', value.notSoleAuthority);
  if (step === 2) return has('response', value.response);
  return false;
}
export function integratePayload(value) {
  if (![0, 1, 2].every(step => integrateStepValid(value, step))) return null;
  const payload = {schemaVersion: 2, capacity: 'integrate', inclusion: {decision: value.inclusionDecision, signals: [...value.signals], limit: value.limitDecision}, notSoleAuthority: value.notSoleAuthority, response: value.response};
  return validIntegratePayload(payload) ? payload : null;
}
export function validIntegratePayload(value) {
  if (!value || value.schemaVersion !== 2 || value.capacity !== 'integrate') return false;
  const included = value.inclusion;
  if (!included || !Array.isArray(included.signals) || included.signals.length > 2 || new Set(included.signals).size !== included.signals.length || !included.signals.every(id => has('signal', id))) return false;
  if (!['unchosen', 'practicalLimit', 'safetyNeed', 'noneToAdd'].includes(included.limit)) return false;
  if (included.decision === 'nothingMore') {
    if (included.signals.length || included.limit !== 'noneToAdd') return false;
  } else if (included.decision !== 'include' || (!included.signals.length && !['practicalLimit', 'safetyNeed'].includes(included.limit))) return false;
  return has('authority', value.notSoleAuthority) && has('response', value.response);
}
export function integrateSummary(value, language = 'en') {
  if (!validIntegratePayload(value)) return '';
  const es = language === 'es', label = (group, id) => INTEGRATE_OPTIONS[group].find(option => option[0] === id)?.[es ? 2 : 1];
  const rows = [], inclusion = value.inclusion;
  if (inclusion.decision === 'nothingMore') rows.push(es ? 'Incluido: Nada más' : 'Included: Nothing more');
  else {
    if (inclusion.signals.length) rows.push(`${es ? 'Incluido' : 'Included'}: ${inclusion.signals.map(id => label('signal', id)).join(' · ')}`);
    if (inclusion.limit !== 'unchosen') rows.push(`${es ? 'Límite' : 'Limit'}: ${label('limit', inclusion.limit)}`);
  }
  rows.push(value.notSoleAuthority === 'nothingTakingOver' ? label('authority', value.notSoleAuthority) : `${es ? 'No decide por sí solo' : 'Not deciding alone'}: ${label('authority', value.notSoleAuthority)}`);
  rows.push(`${es ? 'Llevar a la vida' : 'Carry forward'}: ${label('response', value.response)}`);
  return rows.join('\n');
}
