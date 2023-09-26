#!/usr/bin/perl
use strict;
use warnings FATAL => 'all';
use v5.16;
use YAML;
use Data::Dumper;
use JSON::PP;
use Getopt::Long;

# 输入Markdown文本，包含YAML头部
my $markdown_text = <<'MARKDOWN';
---
title: Sample Title
author: John Doe
date: 2023-09-26
tag:
    - FP
    - MVC
---

```perl
say 'hello!';
say 'hello!';
```

there is desc;
there is desc;
there is desc;
there is desc;
MARKDOWN

sub parse_markdown_snippet {
    $_ = shift;
    /^[\n\s]*((---|\+\+\+)?[\n\s]+|[\n\s]*)(.*)[\n\s]+(---|\+\+\+)[\n\s]+(.*)/s or die 'parse yaml header failed';
    my $yaml_header = $3;
    $_ = $5;
    /```[\n\s]*(\w+)[\n\s]+(.*?)[\n\s]*```[\n\s]+(.*)[\n\s]*$/s or die 'parse snippet and description failed';
    my $lang = $1;
    my $snippet = $2;
    my $desc = $3;
    {
        header  => (Load $yaml_header),
        lang    => $lang,
        snippet => $snippet,
        desc    => $desc,
    }
}

say encode_json parse_markdown_snippet $markdown_text;