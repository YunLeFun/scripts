# 过滤图片文件

例如：“slipper, Durian”这个单词组合和“43410-3575458342-[slipper_Durian]sword,Battlefield and Sky Background,photorealistic,wide shot, finely detailed, purism, ue 5, a compu ”这个文件名可以匹配成功。和“43410-3575458342-[Durian_slipper]sword,Battlefield and Sky Background,photorealistic,wide shot, finely detailed, purism, ue 5, a compu ”这个文件名也可以匹配成功。

- 单词见：`words.txt`

匹配成功则保留文件，无匹配项目则把文件剪切到“I:\项目-梗图融合\无匹配”。匹配完后输出给我未匹配的单词组合名单。
