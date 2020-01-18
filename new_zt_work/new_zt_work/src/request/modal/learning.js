/**
 *  learning 模块接口列表
 */

import base from '../api/base';            // 导入接口域名列表
import instance from '../http';            // 导入 http 中创建 axios 实例

const learning = {
    // 上传题库到练习数据库
    uploadExerciseBank(params) {
        return instance.post(`${base.learning}/learning_center/question_bank/upload`, params);
    },
    // 上传题库到考核数据库
    uploadExaminationQuestionBank(params) {
        return instance.post(`${base.learning}/learning_center/assess_question_bank/upload`, params);
    },
    // 清空题库
    emptyItemBank(params) {
        return instance.post(`${base.learning}/learning_center/question_bank/empty`, params);
    },
    // 查询题库
    getQuestionBank(params) {
        return instance.post(`${base.learning}/learning_center/question_bank/query`, params);
    },
    // 批量删除题库
    deletesQuestionBank(params) {
        return instance.post(`${base.learning}/learning_center/question_bank/delete`, params);
    },
    // 编辑题库
    editQuestionBank(params) {
        return instance.post(`${base.learning}/learning_center/question_bank/edit`, params);
    },
    // 顺序练习
    sequentialParactice(params) {
        return instance.post(`${base.learning}/learning_center/exercise/order`, params);
    },
    // 随机练习
    randomParactice(params) {
        return instance.post(`${base.learning}/learning_center/exercise/random`, params);
    },
    // 练习题答题
    questionBankAnswer(params) {
        return instance.post(`${base.learning}/learning_center/exercise/starting_to_work`, params);
    },
    // 清除练习答题记录
    deleteAnswerRecord(params) {
        return instance.post(`${base.learning}/learning_center/exercise/empty_record`, params);
    },
    // 查看练习题练习状况
    viewStatus(params) {
        return instance.post(`${base.learning}/learning_center/exercise/condition`, params);
    },
    // 点击练习状况展示题目
    displayTopics(params) {
        return instance.post(`${base.learning}/learning_center/exercise/subject_shows`, params);
    },
    // 考核题目
    examinationQuestions(params) {
        return instance.post(`${base.learning}/learning_center/examination/order`, params);
    },
    // 考核题答题
    examinationAnswer(params) {
        return instance.post(`${base.learning}/learning_center/examination/starting_to_work`, params);
    },
    // 考核题提交试卷并显示得分
    submitPapers(params) {
        return instance.post(`${base.learning}/learning_center/examination/submit`, params);
    },
    // 添加管理人员
    addManagerUser(params) {
        return instance.post(`${base.learning}/learning_center/manager/add`, params);
    },
    // 删除管理人员
    deleteManagerUser(params) {
        return instance.post(`${base.learning}/learning_center/manager/del`, params);
    },
    // 查询管理人员
    getManagerUser(params) {
        return instance.post(`${base.learning}/learning_center/manager/query`, params);
    },
    // 编辑管理人员
    editManagerUser(params) {
        return instance.post(`${base.learning}/learning_center/manager/edit`, params);
    },
    // 查看练习题练习状况
    getExamination(params) {
        return instance.post(`${base.learning}/learning_center/examination/condition`, params);
    },
    // 点击考核状况展示题目
    chaeckExamination(params) {
        return instance.post(`${base.learning}/learning_center/examination/subject_shows`, params);
    },
    // 考核题选择题目
    selectExaminationQuestions(params) {
        return instance.post(`${base.learning}/learning_center/examination/select_a_topic`, params);
    },
    // 考核题返回题目
    getExaminationQuestions(params) {
        return instance.post(`${base.learning}/learning_center/examination/Return_to_the_topic`, params);
    },
    // 考核题答题
    getExaminationQuestionsAnswer(params) {
        return instance.post(`${base.learning}/learning_center/examination/starting_to_work`, params);
    },
    // 查看考核题练习状况
    checkExaminationQuestions(params) {
        return instance.post(`${base.learning}/learning_center/examination/condition`, params);
    },
    // 点击考核状况展示题目
    viewExaminationQuestions(params) {
        return instance.post(`${base.learning}/learning_center/examination/subject_shows`, params);
    },
    // 考核题提交试卷并显示得分
    submitExaminationQuestionsAnswer(params) {
        return instance.post(`${base.learning}/learning_center/examination/submit`, params);
    },
    // 查看上传的试卷
    checkTestPaper(params) {
        return instance.post(`${base.learning}/learning_center/test_paper/check`, params);
    },
    // 删除试卷
    deleteTestPaper(params) {
        return instance.post(`${base.learning}/learning_center/test_paper/del`, params);
    },
    // 点击查看上传的试卷列表查看试卷完整信息
    checkTestPaperInfo(params) {
        return instance.post(`${base.learning}/learning_center/test_paper/check_complete_information`, params);
    },
    // 根据试卷完整信息删除题目
    deleteTestPaperOne(params) {
        return instance.post(`${base.learning}/learning_center/test_paper/del_complete_information`, params);
    },
    // 试卷插入题目
    addQuestion(params) {
        return instance.post(`${base.learning}/learning_center/questions/Insert`, params);
    },
    // 文章录入
    addArticle(params) {
        return instance.post(`${base.learning}/learning_center/article/entering`, params);
    },
    // 文章查询(作者后台编辑部分)
    checkArticle(params) {
        return instance.post(`${base.learning}/learning_center/article/query`, params);
    },
    // 查看历史得分
    checkTestScores(params) {
        return instance.post(`${base.learning}/learning_center/grade/check`, params);
    },
    // 文章删除
    deleteArticle(params) {
        return instance.post(`${base.learning}/learning_center/article/del`, params);
    },
    // 文章编辑
    editArticle(params) {
        return instance.post(`${base.learning}/learning_center/article/edit`, params);
    },
    // 文章查询浏览部分
    checkArticle2(params) {
        return instance.post(`${base.learning}/learning_center/article/browse`, params);
    },
    // 新增文章类型
    addArticleType(params) {
        return instance.post(`${base.learning}/learning_center/article_type/install`, params);
    },
    // 查询文章类型
    checkArticleType(params) {
        return instance.post(`${base.learning}/learning_center/article_type/query`, params);
    },
    // 删除文章类型
    deleteArticleType(params) {
        return instance.post(`${base.learning}/learning_center/article_type/del`, params);
    },
    // 编辑文章类型 
    editArticleType(params) {
        return instance.post(`${base.learning}/learning_center/article_type/edit`, params);
    },
    // 文章收藏 
    collectArticle(params) {
        return instance.post(`${base.learning}/learning_center/article/collect`, params);
    },
    // 查看文章收藏列表 
    getCollectArticleData(params) {
        return instance.post(`${base.learning}/learning_center/article_collect/list`, params);
    },
    // 删除文章收藏 
    deleteCollectArticle(params) {
        return instance.post(`${base.learning}/learning_center/article_collect_list/del`, params);
    },
    // 添加文章评论 
    addArticleComment(params) {
        return instance.post(`${base.learning}/learning_center/article_comment/install`, params);
    },
    // 点击文章浏览或收藏部分展示文章详情 
    checkArticleBrowse(params) {
        return instance.post(`${base.learning}/learning_center/article_browse/particulars`, params);
    },
    // 查看我的评论 
    checkMyArticleComment(params) {
        return instance.post(`${base.learning}/learning_center/article_comment/my`, params);
    },
    // 删除我的评论 
    deleteArticleComment(params) {
        return instance.post(`${base.learning}/learning_center/my_article_comment/del`, params);
    },
    // 查看我发布的文章 
    checkMyIssueArticle(params) {
        return instance.post(`${base.learning}/learning_center/issue_my_article/query`, params);
    },
    // 获取文章评论 
    getArticleComment(params) {
        return instance.post(`${base.learning}/learning_center/article_comment/query`, params);
    },
    // 取消收藏 
    cancelArticleComment(params) {
        return instance.post(`${base.learning}/learning_center/article_comment/cancel`, params);
    },
    // 数据统计显示收藏人 
    checkCollectNameData(params) {
        return instance.post(`${base.learning}/learning_center/data_statistics/collect_name`, params);
    },
    // 数据统计显示评论 
    checkArticleCommentData(params) {
        return instance.post(`${base.learning}/learning_center/data_statistics/article_comment`, params);
    },
}

export default learning;