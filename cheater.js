(function () {
    try {
        const API = window.API || window.API_1484_11;

        if (API) {
            //Assigning actual Scorm API set value to a variable so it can be called later 
            const SetValue = API.LMSSetValue || API.SetValue;
    
            //score for Sco
            let max_score = null;
            let score_set = false;
    
            //current interaction values
            let correct_response = null;
            let student_responsed = false;
            let student_response_key = '';
    
            //current objective values
            let max_score_objective = null;
            let score_set_objective = false;
            
            //Fake set value that will be assigned to the API's set value
            const FakeSetValue = (key, value) => {
                const key_sections = key.split('.');
                const last_section = key_sections.pop();
                switch (key_sections[1]) {
                    case 'interactions':
                        switch (last_section) {
                            case 'result':
                                SetValue(key, 'correct');
                                break;
                            case 'pattern':
                                correct_response = value;
                                SetValue(key, correct_response);
                                if (!student_responsed) {
                                    SetValue(student_response_key, correct_response);
                                    student_response_key = '';
                                    correct_response = null;
                                }
                                break;
                            case 'student_response':
                            case 'learner_response':
                                if (correct_response) {
                                    SetValue(key, correct_response);
                                    student_responsed = true;
                                    student_response_key = '';
                                    correct_response = null;
                                } else {
                                    student_response_key = key;
                                }
                                break;
                            default:
                                SetValue(key, value);
                                break;    
    
                        }
                        break;
                    case 'objectives':
                        switch (last_section) {
                            case 'raw':
                                if (max_score_objective) {
                                    SetValue(key, max_score_objective);
                                    score_set_objective = true;
                                    max_score_objective = null;
                                } else {
                                    score_set_objective = false;
                                }
                                break;
                            case 'max':
                                max_score_objective = value;
                                SetValue(key, max_score_objective);
                                if (!score_set_objective) {
                                    SetValue(`${key_sections.join('.')}.raw`, max_score_objective);
                                    score_set_objective = true;
                                    max_score_objective = null;
                                }
                                break;
                            case 'success_status ':    
                            case 'status':
                                SetValue(key, 'passed');
                                break;
                            case 'completion_status':
                                console.log("OBJECTIVE COMPLETION STATUS");
                                SetValue(key, 'completed');
                                break;
                            case 'progress_measure':
                            case 'scaled':   
                                SetValue(key, '1');
                                break;    
                            default:
                                SetValue(key, value);
                                break;        
                        }
                        break;
                    default:
                        switch (last_section) {
                            case 'suspend_data':
                                break;
                            case 'lesson_status':
                            case 'success_status':
                                SetValue(key, 'passed');
                                break;
                            case 'completion_status':
                                console.log("GETTING HERE");
                                SetValue(key, 'completed');
                                break;
                            case 'raw':
                                if (max_score) {
                                    SetValue(key, max_score);
                                    score_set = true;
                                    max_score = null;
                                } else {
                                    score_set = false;
                                }
                                break;
                            case 'max':
                                max_score = value;
                                SetValue(key, max_score);
                                if (!score_set) {
                                    SetValue(`${key_sections.join('.')}.raw`, max_score);
                                    score_set = true;
                                    max_score = null;
                                }
                                break;
                            case 'scaled':   
                                SetValue(key, '1');
                                break;
                            default:
                                SetValue(key, value);
                                break;
                        }
                        break;
                }
            }
    
            API.LMSSetValue = FakeSetValue;
            API.SetValue = FakeSetValue;
    
            alert("Scorm API has successfully been hijacked!");
        }
    } catch (e) {
        console.log(e);
        alert("Tried but unable to hijack the Scorm API!");
    }    
})();