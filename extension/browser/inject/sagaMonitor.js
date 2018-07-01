import { is, SAGA_ACTION } from 'redux-saga/utils'
import {
    EFFECT_TRIGGERED,
    EFFECT_RESOLVED,
    EFFECT_REJECTED,
    EFFECT_CANCELLED,
    ACTION_DISPATCHED
} from '../../../src/store/constants'

function getTime() {
    if (typeof performance !== 'undefined' && performance.now)
        return performance.now()
    else
        return Date.now()
}

function postToContent(action) {
    if (action.effect) {
        action.effect = transformEffect(action.effect);
    }

    window.postMessage({
        source: "@sagaDevTools",
        action: JSON.stringify(action)
    }, "*");

}

export function createSagaRelayMonitor() {
    function effectTriggered(effect) {
        postToContent({
            type: EFFECT_TRIGGERED,
            effect,
            time: getTime()
        })
    }

    function effectResolved(effectId, result) {
        if (is.task(result)) {
            result.done.then(
                taskResult => {
                    if (result.isCancelled())
                        effectCancelled(effectId)
                    else
                        effectResolved(effectId, taskResult)
                },
                taskError => {
                    effectRejected(effectId, taskError)
                }
            )
        } else {
            const action = {
                type: EFFECT_RESOLVED,
                effectId,
                result,
                time: getTime()
            }
            postToContent(action)
        }
    }

    function effectRejected(effectId, error) {
        const action = {
            type: EFFECT_REJECTED,
            effectId,
            error,
            time: getTime()
        }
        postToContent(action)
    }

    function effectCancelled(effectId) {
        const action = {
            type: EFFECT_CANCELLED,
            effectId,
            time: getTime()
        }
        postToContent(action)
    }


    function actionDispatched(action) {
        const isSagaAction = action[SAGA_ACTION]
        const now = getTime();
        postToContent({
            type: ACTION_DISPATCHED,
            id: now,
            action,
            isSagaAction,
            time: now
        })
    }

    return {
        effectTriggered, effectResolved, effectRejected, effectCancelled, actionDispatched
    };
}

function transformEffect(effect) {
    effect = { ...effect };

    if (effect.saga) {
        effect.saga = { name: effect.saga.name };
    }

    if (effect.fn) {
        effect.fn = { name: effect.fn.name }
    };

    if (effect.CALL) {
        transformEffectBody(effect, "CALL", effect.CALL);
    }

    if (effect.CPS) {
        transformEffectBody(effect, "CPS", effect.CPS);
    }

    if (effect.FLUSH) {
        effect.FLUSH = { name: effect.FLUSH.name }
    }

    if (effect.FORK) {
        transformEffectBody(effect, "FORK", effect.FORK);
    }

    if (effect.SELECT) {
        transformEffectBody(effect, "SELECT", effect.SELECT, "selector");
    }

    if (effect.effect) {
        effect.effect = transformEffect(effect.effect);
    }

    return effect;
}

function transformEffectBody(effect, effectName, body, propName = "fn") {
    effect[effectName] = { ...effect[effectName] };
    effect[effectName][propName] = { name: effect[effectName][propName].name }
}