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
        postToContent({
            type: ACTION_DISPATCHED,
            id: now,
            action,
            isSagaAction,
            time: getTime()
        })
    }

    return {
        effectTriggered, effectResolved, effectRejected, effectCancelled, actionDispatched
    };
}
